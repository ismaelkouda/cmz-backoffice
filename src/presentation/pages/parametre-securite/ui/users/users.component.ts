import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public listUsers: Array<any> = [];
  public selectedProfil: any;
  public selectedUSer: any;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public alerteMessage: string
  public principalUsername: string;
  public suffixEmail: string;
  public currentTabsIndex: number = 0;
  
  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    public mappingService: MappingService,
    private parametreSecuriteService: ParametreSecuriteService
  ) {
    this.suffixEmail = this.mappingService.suffixEmail
    this.principalUsername = `admin${this.suffixEmail}`;    
    this.alerteMessage = "Le nombre d'utilisateurs a atteint la limite autorisée"
  }

  ngOnInit() {
    this.GetAllUsers()
    this.isFilter()
  }
  public GetAllUsers() {
    this.settingService.getAllUsers({})
      .subscribe({
        next: (response) => {
          this.listUsers = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onFilter(){
    this.settingService.getAllUsers({
      profil_user: this.selectedProfil,

    })
    .subscribe({
      next: (response) => {
        this.listUsers = response['data']
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    })
  }

  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onInitForm(): void {
    if (this.listUsers.length >=5) {
       this.toastrService.error("Le nombre d'utilisateurs a atteint la limite autorisée");
    }else{
      this.initialView = false;
      this.formsView = true;
      this.currentObject = undefined;
    }
  }
  public handleActivateUser(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Activer l'utilisateur <br> ${data.username} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parametreSecuriteService
          .handleActivateUser(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllUsers();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public handleDisableUser(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Désactiver l'utilisateur <br> ${data.username} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parametreSecuriteService
          .handleDisableUser(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllUsers();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public OnDelete(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous supprimer l'utilisateur <br> ${data.nom}  ${data.prenoms} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
          .OnDeleteUser({
            username: data?.username
          })
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllUsers();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListDatas(event: any): void {
    this.listUsers = event;
  }
  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
  }
  public isFilter(): boolean {
    return (!this.selectedProfil) ? true : false
  }
}
