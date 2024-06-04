import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
import { TreeNode } from 'primeng/api';
import { menuJson } from 'src/assets/menu';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-forms-profil',
  templateUrl: './forms-profil.component.html',
  styleUrls: ['./forms-profil.component.scss']
})
export class FormsProfilComponent implements OnInit {

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
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public applicationType: string;

  constructor(
    private parametreSecuriteService: ParametreSecuriteService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private mappingService: MappingService,
    private storage: EncodingDataService
  ) {
    this.newPermissions = menuJson;
    this.newPermissions.slice(1)
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.applicationType = this.mappingService.applicationType;
  }

  ngOnInit() {
    this.isDisabled();
    if (!this.currentObject?.show) {
      this.GetAllThirdLevelHabilitation();
      this.GetAllSecondLevelHabilitation();
      this.GetAllFirstLevelHabilitation();
    }    
    if (this.applicationType === ApplicationType.PATRIMOINESIM) {      
      this.newPermissionSlice = this.newPermissions;
    }else if(this.applicationType === ApplicationType.MONITORING){
     
      this.newPermissions = this.newPermissions.filter(objet => objet.hasOwnProperty('pack'));
      this.newPermissions.forEach(item => {
        if (item?.children) {
          item.children = item.children.filter(objet => objet.hasOwnProperty('pack'));
        }
      });
     this.newPermissionSlice = this.newPermissions;
    }
    this.newPermissionSlice.map(module => {
      if (module.children) {
        module.children = module.children.map(sous_module => {
          return {
            ...sous_module,
            children: sous_module.actions ?? [],
          }
        })
      }
      this.permissions.push(module)
      this.dataSourceFiles = <TreeNode[]>this.permissions
    })
    if (this.currentObject !== undefined) {
      this.selectedNom = this.currentObject.nom;
      this.selectedDescription = this.currentObject.description;
      this.selectedMode = this.currentObject.mode_lecture;
      this.newPermissionSlice.map(parentN1Permission => {
        if (this.currentObject.permissions.includes(parentN1Permission.data)) {
          this.selectedItemsDataSource.push(parentN1Permission)
        }
        parentN1Permission?.children.map((element) => {
          if (this.currentObject.permissions.includes(element.data)) {
            this.selectedItemsDataSource.push(element)
          }
        })
      })
      // Get Current Habilitation Node

      setTimeout(() => {
        this.habilitationSourceFiles.map(parentHabilitation => {
          if (parentHabilitation?.label === this.firstLevelLibelle) {
            parentHabilitation?.children.map((niveau) => {            
              if (this.currentObject.habilitationsNiveauUn.includes(niveau.uuid)) {
                this.selectedItemsHabilitationSource.push(niveau)
              }
            })
          }else if (parentHabilitation?.label === this.thirdLevelLibelle) {
            parentHabilitation?.children.map((niveau) => {            
              if (this.currentObject.habilitationsNiveauTrois.includes(niveau.uuid)) {
                this.selectedItemsHabilitationSource.push(niveau)
              }
            })
          }else if (parentHabilitation?.label === this.secondLevelLibelle) {
            parentHabilitation?.children.map((niveau) => {            
              if (this.currentObject.habilitationsNiveauDeux.includes(niveau.uuid)) {
                this.selectedItemsHabilitationSource.push(niveau)
              }
              
            })
          }
        }) 
      }, 2000);
    }    
  }

  public GetAllProfilHabilitations() {
    this.parametreSecuriteService
      .GetAllProfilHabilitations({})
      .subscribe({
        next: (response) => {
          this.listProfils.emit(response['data']);
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public close(): void {
    this.formsView.emit(false);
  }
  public expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      })
    }
  }
  public expandAllPermission() {
    this.dataSourceFiles.forEach(node => {
      this.expandRecursive(node, true);
    });
  }
  public collapseAllPermission() {
    this.dataSourceFiles.forEach(node => {
      this.expandRecursive(node, false);
    });
  }
  // Security
  public expandAllHabilitations() {
    this.LevelDataSources.forEach(node => {
      this.expandRecursive(node, true);
    });
  }
  public collapseAllHabilitations() {
    this.LevelDataSources.forEach(node => {
      this.expandRecursive(node, false);
    });
  }
  handleSaveProfilHabilitation() {
    const selectedItemsDataSource = this.selectedItemsDataSource.map((element) => {      
      return element.data
    });
    const firstArray = [];
    const secondArray = []
    const thirdArray = []
    this.selectedItemsHabilitationSource.map((element) => {
      if (element?.parent?.label === this.firstLevelLibelle) {
        firstArray.push(element.uuid)
      }else if(element?.parent?.label === this.secondLevelLibelle){
        secondArray.push(element.uuid)
      }else if(element?.parent?.label === this.thirdLevelLibelle){
        thirdArray.push(element.uuid)
      }
    });
    this.parametreSecuriteService
      .handleSaveProfilHabilitation({
        nom: this.selectedNom,
        mode_lecture: this.selectedMode,
        description: this.selectedDescription,
        permissions: [
          ...selectedItemsDataSource,
          '7-0-0-structure-orga',
           '7-1-0-structure-orga-niveau-1',
           '7-2-0-structure-orga-niveau-2',
           '7-3-0-structure-orga-niveau-3',
           '7-4-0-structure-orga-usage'
        ],
        niveau_uns: firstArray,
        niveau_deux: secondArray,
        niveau_trois: thirdArray
      }).subscribe({
        next: (response) => {
          this.GetAllProfilHabilitations();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  handleUpdateProfilHabilitation() {
    const firstArray = [];
    const secondArray = [];
    const thirdArray = []
    this.selectedItemsHabilitationSource.map((element) => {
      if (element?.parent?.label === this.firstLevelLibelle) {
        firstArray.push(element.uuid)
      }else if(element?.parent?.label === this.secondLevelLibelle){
        secondArray.push(element.uuid)
      }else if(element?.parent?.label === this.thirdLevelLibelle){
        thirdArray.push(element.uuid)
      }
    });
    const selectedItemsDataSource = this.selectedItemsDataSource.map(element => element.data);
    this.parametreSecuriteService
      .handleUpdateProfilHabilitation({
        nom: this.selectedNom,
        mode_lecture: this.selectedMode,
        description: this.selectedDescription,
        permissions: [
            ...selectedItemsDataSource,
            '7-0-0-structure-orga',
             '7-1-0-structure-orga-niveau-1',
             '7-2-0-structure-orga-niveau-2',
             '7-3-0-structure-orga-niveau-3',
             '7-4-0-structure-orga-usage'
          ],
        niveau_uns: firstArray,
        niveau_deux: secondArray,
        niveau_trois: thirdArray
      }, this.currentObject.id).subscribe({
        next: (response) => {
          this.GetAllProfilHabilitations();
          this.toastrService.success(response.message);
          this.storage.saveData('isProfil',"is_profil");
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllFirstLevelHabilitation() {
    this.settingService
      .GetAllFirstLevelHabilitation({})
      .subscribe({
        next: (response) => {
          const habilitations = [];          
          const resValues = response['data'].map((item) => {
            return {...item,label: item?.nom,data: item?.code };
          });
          this.firstLevelMapping= { label: this.firstLevelLibelle,expanded: true, children: resValues}
          this.LevelDataSources.push(this.firstLevelMapping)
          this.LevelDataSources.map(module => {
            if (module.children) {
              module.children = module.children.map(sous_module => {
                return {
                  ...sous_module,
                  children: sous_module.actions ?? [],
                }
              })
            }
            habilitations.push(module)
            this.habilitationSourceFiles = <TreeNode[]>habilitations
          })
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllSecondLevelHabilitation() {
    this.settingService
      .GetAllSecondLevelHabilitation({})
      .subscribe({
        next: (response) => {
          const habilitations = [];          
          const resValues = response['data'].map((item) => {
            return {...item,label: item?.nom,data: item?.code };
          });
          this.secondLevelMapping = { label: this.secondLevelLibelle,expanded: true, children: resValues}
          this.LevelDataSources.push(this.secondLevelMapping)
          this.LevelDataSources.map(module => {
            if (module.children) {
              module.children = module.children.map(sous_module => {
                return {
                  ...sous_module,
                  children: sous_module.actions ?? [],
                }
              })
            }
            habilitations.push(module)
            this.habilitationSourceFiles = <TreeNode[]>habilitations
          })
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllThirdLevelHabilitation() {
    this.settingService
      .GetAllThirdLevelHabilitation({})
      .subscribe({
        next: (response) => {                    
          const habilitations = [];          
          const resValues = response['data'].map((item) => {
            return {...item,label: item?.nom,data: item?.code };
          });
          this.thirdLevelDataMapping= { label: this.thirdLevelLibelle,expanded: true, children: resValues}
          this.LevelDataSources.push(this.thirdLevelDataMapping)
          this.LevelDataSources.map(module => {
            if (module.children) {
              module.children = module.children.map(sous_module => {
                return {
                  ...sous_module,
                  children: sous_module.actions ?? [],
                }
              })
            }
            habilitations.push(module)
            this.habilitationSourceFiles = <TreeNode[]>habilitations
          })
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  isDisabled(): boolean {
    return (this.selectedItemsDataSource?.length === 0 || !this.currentObject?.nom) ? true : false
  }
}
