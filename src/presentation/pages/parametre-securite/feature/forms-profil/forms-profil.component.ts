import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
import { TreeNode } from 'primeng/api';
import { menuJson } from 'src/assets/menu';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { FormsProfilApiService } from '../../data-access/services/forms-profil/forms-profil.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StoreCurrentUserService } from '@shared/services/store-current-user.service';
import { CurrentUser } from '../../../../../shared/interfaces/current-user.interface';

// Définition du type des permissions pour une meilleure lisibilité
interface PermissionNode {
    key: string;
    data: {
        title: string;
        value: string;
        checked: boolean;
    };
    children?: PermissionNode[];
}
@Component({
    selector: 'app-forms-profil',
    templateUrl: './forms-profil.component.html',
    styleUrls: ['./forms-profil.component.scss'],
})
export class FormsProfilComponent implements OnInit, OnDestroy {
    @Input() currentObject;
    @Output() formsView = new EventEmitter();
    @Output() listProfils = new EventEmitter();
    public selectedItemsDataSource: Array<any> = [];
    public selectedItemsHabilitationSource: Array<any> = [];
    public dataSourceFiles: Array<any> = [];
    public habilitationSourceFiles: Array<any> = [];
    public permissions: Array<any> = [];
    public newPermissions: any;
    public newPermissionSlice: any[] = [];
    public selectedNom: string;
    public selectedMode: boolean;
    public selectedDescription: string;
    public firstLevelMapping: any;
    public secondLevelMapping: any;
    public thirdLevelDataMapping: any;
    public LevelDataSources: Array<any> = [];
    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;
    public applicationType: string;

    public listPermissions$: Observable<Array<any>>;
    public checkedPermission: Array<any>;

    public listHabilitation$: Observable<Array<any>>;
    public checkedHabilitation: Array<any>;
    private destroy$ = new Subject<void>();

    constructor(
        private parametreSecuriteService: ParametreSecuriteService,
        private toastrService: ToastrService,
        private mappingService: MappingService,
        private formsProfilApiService: FormsProfilApiService,
        private encodingService: EncodingDataService
    ) {
        this.newPermissions = menuJson;
        this.newPermissions.slice(1);
        this.applicationType = this.mappingService.applicationType;
    }

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.firstLevelLibel = user?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel = user?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel = user?.structure_organisationnelle?.niveau_3;

        this.formsProfilApiService.fetchPermissions(
            this.currentObject?.id ? `/${this.currentObject?.id}` : ''
        );
        this.listPermissions$ = this.formsProfilApiService.getPermissions();
        if (!this.currentObject?.show) {
            this.formsProfilApiService
                .getPermissions()
                .subscribe((permissions) => {
                    this.checkedPermission =
                        this.getCheckedPermissions(permissions);
                });
        }

        this.formsProfilApiService.fetchHabilitation(
            this.currentObject?.id ? `/${this.currentObject?.id}` : ''
        );
        this.listHabilitation$ = this.formsProfilApiService.getHabilitation();
        if (!this.currentObject?.show) {
            this.formsProfilApiService
                .getHabilitation()
                .subscribe((habilitation) => {
                    this.checkedHabilitation =
                        this.getCheckedHabilitation(habilitation);
                });
        }

        // this.isDisabled();
        // if (this.applicationType === ApplicationType.PATRIMOINESIM) {
        //   this.newPermissionSlice = this.newPermissions;
        // } else if (this.applicationType === ApplicationType.MONITORING) {

        //   this.newPermissions = this.newPermissions.filter(objet => objet.hasOwnProperty('pack'));
        //   this.newPermissions.forEach(item => {
        //     if (item?.children) {
        //       item.children = item.children.filter(objet => objet.hasOwnProperty('pack'));
        //     }
        //   });
        //   this.newPermissionSlice = this.newPermissions;
        // }
        // this.newPermissionSlice.map(module => {
        //   if (module.children) {
        //     module.children = module.children.map(sous_module => {
        //       return {
        //         ...sous_module,
        //         children: sous_module.actions ?? [],
        //       }
        //     })
        //   }
        //   this.permissions.push(module)
        //   this.dataSourceFiles = <TreeNode[]>this.permissions
        // })
        if (this.currentObject !== undefined) {
            this.selectedNom = this.currentObject.nom;
            this.selectedDescription = this.currentObject.description;
            this.selectedMode = this.currentObject.mode_lecture;
            // this.newPermissionSlice.map(parentN1Permission => {
            //   if (this.currentObject.permissions.includes(parentN1Permission.data)) {
            //     this.selectedItemsDataSource.push(parentN1Permission)
            //   }
            //   parentN1Permission?.children.map((element) => {
            //     if (this.currentObject.permissions.includes(element.data)) {
            //       this.selectedItemsDataSource.push(element)
            //     }
            //   })
            // })
            //   // Get Current Habilitation Node

            //   setTimeout(() => {
            //     this.habilitationSourceFiles.map(parentHabilitation => {
            //       if (parentHabilitation?.label === this.firstLevelLibel) {
            //         parentHabilitation?.children.map((niveau) => {
            //           if (this.currentObject.habilitationsNiveauUn.includes(niveau.uuid)) {
            //             this.selectedItemsHabilitationSource.push(niveau)
            //           }
            //         })
            //       } else if (parentHabilitation?.label === this.thirdLevelLibel) {
            //         parentHabilitation?.children.map((niveau) => {
            //           if (this.currentObject.habilitationsNiveauTrois.includes(niveau.uuid)) {
            //             this.selectedItemsHabilitationSource.push(niveau)
            //           }
            //         })
            //       } else if (parentHabilitation?.label === this.secondLevelLibel) {
            //         parentHabilitation?.children.map((niveau) => {
            //           if (this.currentObject.habilitationsNiveauDeux.includes(niveau.uuid)) {
            //             this.selectedItemsHabilitationSource.push(niveau)
            //           }

            //         })
            //       }
            //     })
            //   }, 2000);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    getCheckedPermissions(nodes: any[]): any[] {
        let checkedItems: any[] = [];

        nodes.forEach((node) => {
            if (node.checked) {
                checkedItems.push(node);
                // this.expandRecursive(node, true);
            }

            if (node.children && node.children.length > 0) {
                checkedItems = checkedItems.concat(
                    this.getCheckedPermissions(node.children)
                );
            }
        });

        return checkedItems;
    }
    getCheckedHabilitation(nodes: any[]): any[] {
        let checkedItems: any[] = [];

        nodes.forEach((node) => {
            if (node.checked) {
                checkedItems.push(node);
                // this.expandRecursive(node, true);
            }

            if (node.children && node.children.length > 0) {
                checkedItems = checkedItems.concat(
                    this.getCheckedHabilitation(node.children)
                );
            }
        });

        return checkedItems;
    }

    public close(): void {
        this.formsView.emit(false);
    }
    public expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach((childNode) => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }
    public expandAllPermission() {
        this.formsProfilApiService.getPermissions().subscribe((permissions) => {
            permissions.forEach((node) => {
                this.expandRecursive(node, true);
            });
        });
    }
    public collapseAllPermission() {
        this.formsProfilApiService.getPermissions().subscribe((permissions) => {
            permissions.forEach((node) => {
                this.expandRecursive(node, false);
            });
        });
    }
    public expandAllHabilitation() {
        this.formsProfilApiService
            .getHabilitation()
            .subscribe((permissions) => {
                permissions.forEach((node) => {
                    this.expandRecursive(node, true);
                });
            });
    }
    public collapseAllHabilitation() {
        this.formsProfilApiService
            .getHabilitation()
            .subscribe((permissions) => {
                permissions.forEach((node) => {
                    this.expandRecursive(node, false);
                });
            });
    }
    // Security
    public expandAllHabilitations() {
        this.LevelDataSources.forEach((node) => {
            this.expandRecursive(node, true);
        });
    }
    public collapseAllHabilitations() {
        this.LevelDataSources.forEach((node) => {
            this.expandRecursive(node, false);
        });
    }
    handleUpdatePermission(): void {
        let selectedPermissionValues: any[] = [];
        this.checkedPermission.forEach((node) => {
            selectedPermissionValues.push(node.value);

            if (node.children && node.children.length > 0) {
                node.children.forEach((nodeChild) => {
                    selectedPermissionValues.push(nodeChild.value);
                });
            }
        });
        let selectedHabilitationValues: any[] = [];
        this.checkedHabilitation.forEach((node) => {
            selectedHabilitationValues.push({
                [node.parent_value]: node.value,
            });
        });
        const formatSelectedHabilitationValues = {
            niveau_uns: [] as string[],
            niveau_deux: [] as string[],
            niveau_trois: [] as string[],
        };
        selectedHabilitationValues.forEach((item) => {
            if (item.niveau_uns) {
                formatSelectedHabilitationValues.niveau_uns.push(
                    item.niveau_uns
                );
            } else if (item.niveau_deux) {
                formatSelectedHabilitationValues.niveau_deux.push(
                    item.niveau_deux
                );
            } else if (item.niveau_trois) {
                formatSelectedHabilitationValues.niveau_trois.push(
                    item.niveau_trois
                );
            }
        });

        const firstArray = [];
        const secondArray = [];
        const thirdArray = [];
        this.selectedItemsHabilitationSource.map((element) => {
            if (element?.parent?.label === this.firstLevelLibel) {
                firstArray.push(element.uuid);
            } else if (element?.parent?.label === this.secondLevelLibel) {
                secondArray.push(element.uuid);
            } else if (element?.parent?.label === this.thirdLevelLibel) {
                thirdArray.push(element.uuid);
            }
        });
        this.parametreSecuriteService
            .handleUpdateProfilHabilitation(
                {
                    nom: this.selectedNom,
                    mode_lecture: this.selectedMode,
                    description: this.selectedDescription,
                    ...formatSelectedHabilitationValues,
                    permissions: [
                        ...selectedPermissionValues,
                        // '7-0-0-structure-orga',
                        // '7-1-0-structure-orga-niveau-1',
                        // '7-2-0-structure-orga-niveau-2',
                        // '7-3-0-structure-orga-niveau-3',
                        // '7-4-0-structure-orga-usage'
                    ],
                },
                this.currentObject.id
            )
            .subscribe({
                next: (response) => {
                    this.GetAllProfilHabilitations();
                    this.toastrService.success(response.message);
                    this.encodingService.saveData('isProfil', 'is_profil');
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    handleSavePermission() {
        let selectedPermissionValues: any[] = [];
        this.checkedPermission.forEach((node) => {
            selectedPermissionValues.push(node.value);

            if (node.children && node.children.length > 0) {
                node.children.forEach((nodeChild) => {
                    selectedPermissionValues.push(nodeChild.value);
                });
            }
        });

        let selectedHabilitationValues: any[] = [];
        this.checkedHabilitation.forEach((node) => {
            // selectedHabilitationValues.push(node.value);
            selectedHabilitationValues.push({
                [node.parent_value]: node.value,
            });

            // if (node.children && node.children.length > 0) {
            //   node.children.forEach((nodeChild) => {
            //     selectedHabilitationValues.push({[node.parent_value]: nodeChild.value});
            //   })
            // }
        });
        const formatSelectedHabilitationValues = {
            niveau_uns: [] as string[],
            niveau_deux: [] as string[],
            niveau_trois: [] as string[],
        };
        selectedHabilitationValues.forEach((item) => {
            if (item.niveau_uns) {
                formatSelectedHabilitationValues.niveau_uns.push(
                    item.niveau_uns
                );
            } else if (item.niveau_deux) {
                formatSelectedHabilitationValues.niveau_deux.push(
                    item.niveau_deux
                );
            } else if (item.niveau_trois) {
                formatSelectedHabilitationValues.niveau_trois.push(
                    item.niveau_trois
                );
            }
        });

        const selectedItemsDataSource = this.selectedItemsDataSource.map(
            (element) => {
                return element.data;
            }
        );
        const firstArray = [];
        const secondArray = [];
        const thirdArray = [];
        this.selectedItemsHabilitationSource.map((element) => {
            if (element?.parent?.label === this.firstLevelLibel) {
                firstArray.push(element.uuid);
            } else if (element?.parent?.label === this.secondLevelLibel) {
                secondArray.push(element.uuid);
            } else if (element?.parent?.label === this.thirdLevelLibel) {
                thirdArray.push(element.uuid);
            }
        });
        this.parametreSecuriteService
            .handleSaveProfilHabilitation({
                nom: this.selectedNom,
                mode_lecture: this.selectedMode,
                description: this.selectedDescription,
                ...formatSelectedHabilitationValues,
                permissions: [
                    ...selectedPermissionValues,
                    // ...selectedItemsDataSource,
                    // '7-0-0-structure-orga',
                    // '7-1-0-structure-orga-niveau-1',
                    // '7-2-0-structure-orga-niveau-2',
                    // '7-3-0-structure-orga-niveau-3',
                    // '7-4-0-structure-orga-usage'
                ],
            })
            .subscribe({
                next: (response) => {
                    this.GetAllProfilHabilitations();
                    this.toastrService.success(response.message);
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    handleUpdateProfilHabilitation() {
        let selectedDataValues: any[] = [];
        this.checkedHabilitation.forEach((node) => {
            selectedDataValues.push(node.value);

            if (node.children && node.children.length > 0) {
                node.children.forEach((nodeChild) => {
                    selectedDataValues.push(nodeChild.value);
                });
            }
        });

        const firstArray = [];
        const secondArray = [];
        const thirdArray = [];
        this.selectedItemsHabilitationSource.map((element) => {
            if (element?.parent?.label === this.firstLevelLibel) {
                firstArray.push(element.uuid);
            } else if (element?.parent?.label === this.secondLevelLibel) {
                secondArray.push(element.uuid);
            } else if (element?.parent?.label === this.thirdLevelLibel) {
                thirdArray.push(element.uuid);
            }
        });
        const selectedItemsDataSource = this.selectedItemsDataSource.map(
            (element) => element.data
        );
        this.parametreSecuriteService
            .handleUpdateProfilHabilitation(
                {
                    nom: this.selectedNom,
                    mode_lecture: this.selectedMode,
                    description: this.selectedDescription,
                    permissions: [
                        ...selectedDataValues,
                        '7-0-0-structure-orga',
                        '7-1-0-structure-orga-niveau-1',
                        '7-2-0-structure-orga-niveau-2',
                        '7-3-0-structure-orga-niveau-3',
                        '7-4-0-structure-orga-usage',
                    ],
                },
                this.currentObject.id
            )
            .subscribe({
                next: (response) => {
                    this.GetAllProfilHabilitations();
                    this.toastrService.success(response.message);
                    this.encodingService.saveData('isProfil', 'is_profil');
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    public GetAllProfilHabilitations() {
        this.parametreSecuriteService.GetAllProfilHabilitations({}).subscribe({
            next: (response) => {
                this.listProfils.emit(response['data']);
                this.close();
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    // public GetAllFirstLevelHabilitation() {
    //   this.settingService
    //     .GetAllFirstLevelHabilitation({})
    //     .subscribe({
    //       next: (response) => {
    //         const habilitations = [];
    //         const resValues = response['data'].map((item) => {
    //           return { ...item, label: item?.nom, data: item?.code };
    //         });
    //         this.firstLevelMapping = { label: this.firstLevelLibel, expanded: true, children: resValues }
    //         this.LevelDataSources.push(this.firstLevelMapping)
    //         this.LevelDataSources.map(module => {
    //           if (module.children) {
    //             module.children = module.children.map(sous_module => {
    //               return {
    //                 ...sous_module,
    //                 children: sous_module.actions ?? [],
    //               }
    //             })
    //           }
    //           habilitations.push(module)
    //           this.habilitationSourceFiles = <TreeNode[]>habilitations
    //         })
    //       },
    //       error: (error) => {
    //         this.toastrService.error(error.error.message);
    //       }
    //     })
    // }
    // public GetAllSecondLevelHabilitation() {
    //   this.settingService
    //     .GetAllSecondLevelHabilitation({})
    //     .subscribe({
    //       next: (response) => {
    //         const habilitations = [];
    //         const resValues = response['data'].map((item) => {
    //           return { ...item, label: item?.nom, data: item?.code };
    //         });
    //         this.secondLevelMapping = { label: this.secondLevelLibel, expanded: true, children: resValues }
    //         this.LevelDataSources.push(this.secondLevelMapping)
    //         this.LevelDataSources.map(module => {
    //           if (module.children) {
    //             module.children = module.children.map(sous_module => {
    //               return {
    //                 ...sous_module,
    //                 children: sous_module.actions ?? [],
    //               }
    //             })
    //           }
    //           habilitations.push(module)
    //           this.habilitationSourceFiles = <TreeNode[]>habilitations
    //         })
    //       },
    //       error: (error) => {
    //         this.toastrService.error(error.error.message);
    //       }
    //     })
    // }
    // public GetAllThirdLevelHabilitation() {
    //   this.settingService
    //     .GetAllThirdLevelHabilitation({})
    //     .subscribe({
    //       next: (response) => {
    //         const habilitations = [];
    //         const resValues = response['data'].map((item) => {
    //           return { ...item, label: item?.nom, data: item?.code };
    //         });
    //         this.thirdLevelDataMapping = { label: this.thirdLevelLibel, expanded: true, children: resValues }
    //         this.LevelDataSources.push(this.thirdLevelDataMapping)
    //         this.LevelDataSources.map(module => {
    //           if (module.children) {
    //             module.children = module.children.map(sous_module => {
    //               return {
    //                 ...sous_module,
    //                 children: sous_module.actions ?? [],
    //               }
    //             })
    //           }
    //           habilitations.push(module)
    //           this.habilitationSourceFiles = <TreeNode[]>habilitations
    //         })
    //       },
    //       error: (error) => {
    //         this.toastrService.error(error.error.message);
    //       }
    //     })
    // }

    isDisabled(): boolean {
        return this.selectedItemsDataSource?.length === 0 ||
            !this.currentObject?.nom
            ? true
            : false;
    }
}
