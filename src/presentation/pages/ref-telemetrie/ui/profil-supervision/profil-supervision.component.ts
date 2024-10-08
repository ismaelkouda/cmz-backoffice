import { DeployStatut } from './../../../../../shared/enum/DeployStatut.enum';
import { ExcelService } from './../../../../../shared/services/excel.service';
import { Component, OnInit } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-profil-supervision',
  templateUrl: './profil-supervision.component.html',
  styleUrls: ['./profil-supervision.component.scss']
})
export class ProfilSupervisionComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public currentObject: any;
  public total:number = 0;
  public seuilCritique: number;
  public listProfils: any[] = [];
  public selectedMsisdn: string;
  public selectedImsi: string;
  public statutAttente: string = DeployStatut.EN_ATTENTE;
  public statutEncours: string = DeployStatut.EN_COURS;
  public statutActif: string = DeployStatut.ACTIF;
  public statutInactif: string = DeployStatut.INACTIF;
  public title = 'Profils supervision - Système de Gestion de Collecte Centralisée';

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    public mappingService: MappingService,
    private excelService: ExcelService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GetAllProfilSupervision();
    this.isFilter();
    this.GetAllAlertPrevention();
  }


  public GetAllProfilSupervision(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
      .subscribe({
        next: (response) => {
          this.listProfils = response['data'];
          this.total = response['data'].length;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllAlertPrevention(): void {
    this.telemetrieService
      .GetAllPrevention({})
      .subscribe({
        next: (response) => {
          console.log("Alert prevention", response);
          this.seuilCritique = response.data;
          console.log("content seuilCritique :", this.seuilCritique);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
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
  public onViewAffection(data: any): void {
    this.initialView = false;
    this.affectationView = true;
    this.currentObject = data;
  }

  public onViewVisualisation(data: any): void {
    this.initialView = false;
    this.visualisationView = true;
    this.currentObject = data;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushAffectationView(event: boolean): void {
    this.affectationView = event;
    this.initialView = !event;
  }
  public pushVisualisationView(event: boolean): void {
    this.visualisationView = event;
    this.initialView = !event;
  }

  public pushListProfils(event: any): void {
    this.listProfils = event;
  }
  public handleActivateProfil(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Activer le profil <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.telemetrieService
          .handleActivateProfil(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllProfilSupervision();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public handleDisableProfil(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Désactiver le profil <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.telemetrieService
          .handleDisableProfil(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllProfilSupervision();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  onFilter() {
    this.telemetrieService
      .GetAllProfilSupervision({
        msisdn: this.selectedMsisdn,
        imsi: this.selectedImsi
      })
      .subscribe({
        next: (response) => {
          this.listProfils = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public OnRefresh(){
     this.selectedMsisdn = null;
     this.selectedImsi = null;
     this.GetAllProfilSupervision()
  }

  public OnDeploy(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Deployer le profil <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.telemetrieService
          .OnDeploy({
            profil_supervision_id: data?.id
          })
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllProfilSupervision();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public isFilter(): boolean {
    return (!this.selectedMsisdn && !this.selectedImsi) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listProfils.map((item: any) => ({
      'Nom': item?.nom,
      'Description': item?.description,
      'Date de création': item?.created_at,
      'Date de modification': item?.updated_at,
      'SIM affectés': item?.sims_count,
      'Statut': item?.statut
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des Profils de supervisions');
  }
}
