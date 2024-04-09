import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-usage-metier',
  templateUrl: './usage-metier.component.html',
  styleUrls: ['./usage-metier.component.scss']
})
export class UsageMetierComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public listUsages: Array<any> = [];
  public selectedUsage: string;
  public selectedTenant: any
  public title = 'Usage metier - Système de Gestion de Collecte Centralisée';
  constructor(
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private settingService: SettingService,
    public mappingService: MappingService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit(): void {
    this.GetAllUsageMetier()
    this.isFilter()
  }

  public GetAllUsageMetier() {
    this.settingService
      .getAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsages = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
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
    this.listUsages = event;
  }
  public handleActivate(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Activer l'usage <br> ${data.nom_tenant} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
          .HandleActiveUsage(data.id)
          .subscribe({
            next: (response) => {
              this.GetAllUsageMetier();
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public handleDisable(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Désactiver l'usage <br> ${data.nom_tenant} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
        .HandleDisableUsage(data.id)
        .subscribe({
            next: (response) => {
              this.GetAllUsageMetier();
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public handleDelete(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Supprimer l'usage <br> ${data.nom_usage} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
          .OnDeleteUsage(data.id).subscribe({
            next: (response) => {
              this.GetAllUsageMetier();
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }

  public isFilter(): boolean {
    return (!this.selectedTenant && !this.selectedUsage) ? true : false
  }

}
