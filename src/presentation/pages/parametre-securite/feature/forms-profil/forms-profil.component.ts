import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
import { TreeNode } from 'primeng/api';
import { menuJson } from 'src/assets/menu';
import { Router } from '@angular/router';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';


@Component({
  selector: 'app-forms-profil',
  templateUrl: './forms-profil.component.html',
  styleUrls: ['./forms-profil.component.scss']
})
export class FormsProfilComponent implements OnInit, OnDestroy {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  @Output() listProfils = new EventEmitter();
  public listProfilHabilitations: Array<any> = [];
  public selectedItemsDataSource: Array<any> = [];
  public permissionExploitations: Array<any> = [];
  public dataSourceFiles: Array<any> = [];
  public selectedItemsDataDirectReg: any;
  public permissions: Array<any> = [];
  public newPermissions: any;
  public newPermissionSlice: any;
  public selectedNom: string;
  public selectedDescription: string;
  public currentACtion: any;
  constructor(
    private parametreSecuriteService: ParametreSecuriteService,
    private toastrService: ToastrService,
    private router: Router,
    private storage: EncodingDataService
  ) {
    this.newPermissions = menuJson;
    this.newPermissions.slice(1)
  }

  ngOnInit() {
    this.isDisabled();
    this.newPermissionSlice = this.newPermissions.slice(1)
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
  public expandAllHabilitations() {
    this.dataSourceFiles.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  public collapseAllHabilitations() {
    this.dataSourceFiles.forEach(node => {
      this.expandRecursive(node, false);
    });
  }
  collapseAllPermissions() { }
  expandAllPermissions() { }

  handleSaveProfilHabilitation() {
    const selectedItemsDataSource = this.selectedItemsDataSource.map((element) => {
      element.data
    });
    const data = {
      nom: this.selectedNom,
      description: this.selectedDescription,
      permissions: selectedItemsDataSource
    }
    this.parametreSecuriteService
      .handleSaveProfilHabilitation({
        nom: this.selectedNom,
        description: this.selectedDescription,
        permissions: selectedItemsDataSource
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
    const selectedItemsDataSource = this.selectedItemsDataSource.map(element => element.data)
    this.parametreSecuriteService
      .handleUpdateProfilHabilitation({
        nom: this.selectedNom,
        description: this.selectedDescription,
        permissions: selectedItemsDataSource
      }, this.currentObject.id).subscribe({
        next: (response) => {
          this.GetAllProfilHabilitations();
          this.toastrService.success(response.message);
          this.storage.removeData('user');
          this.storage.removeData('current_menu');
          this.router.navigateByUrl('auth/login');
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  isDisabled(): boolean {
    return (this.selectedItemsDataSource?.length === 0 || !this.currentObject?.nom) ? true : false
  }

  ngOnDestroy(): void {
    //location.reload()
  }
}
