import { PatrimoineService } from './../../../patrimoine/data-access/patrimoine.service';
import { ToastrService } from 'ngx-toastr';
import { SupervisionOperationService } from './../../data-access/supervision-operation.service';
import { Component, OnInit } from '@angular/core';


export enum TypesTransactions {
  ACHAT_SERVICE = 'Achats de Services',
  ACTIVATION_SIM = 'Activation de SIM',
  CHANGEMENT_SIM = 'Changement de SIM',
  SUPERVISION_SIM = 'Supervision de SIM',
  RESILIATION_SIM = 'Résiliation',
  DEPOT_VOLUME = 'Dépot de Volume',
  LIGNE_CREDIT = 'Ligne de credit'
}
@Component({
  selector: 'app-alarmes',
  templateUrl: './alarmes.component.html',
  styleUrls: ['./alarmes.component.scss']
})
export class AlarmesComponent implements OnInit {

  public activationsListe: Array<any> = [];
  public datasSourceListe: Array<any> = [];
  public parametresListe: Array<any> = [];
  public securitesListe: Array<any> = [];
  public synchroListe: Array<any> = [];
  public listOperations: Array<any> = [];
  public dataSource: Array<any> = [];
  public filterStatus: string;
  public filtreSelected: string;

  public typeAchat: string = TypesTransactions.ACHAT_SERVICE;
  public typeActivation: string = TypesTransactions.ACTIVATION_SIM;
  public typeChangement: string = TypesTransactions.CHANGEMENT_SIM;
  public typeSupervision: string = TypesTransactions.SUPERVISION_SIM;
  public typeResiliation: string = TypesTransactions.RESILIATION_SIM;
  public typeVolume: string = TypesTransactions.DEPOT_VOLUME;
  public typeLigne: string = TypesTransactions.LIGNE_CREDIT;



  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private patrimoineService: PatrimoineService,
  ) {

    this.filterStatus = this.typeAchat;
    this.filtreSelected = TypesTransactions.ACHAT_SERVICE;
  }

  ngOnInit() {
    // this.GetAllTrnasactions();
    // this.GetAllPatrimoine();
    localStorage.setItem('layout', 'Barcelona');

  }

  public GetAllTrnasactions() {
    this.supervisionOperationService
      .GetAllTrnasactions({})
      .subscribe({
        next: (response) => {
          this.activationsListe = response.data.activations;
          this.datasSourceListe = response.data.data_sources;
          this.parametresListe = response.data.parametres_collecte;
          this.securitesListe = response.data.securite;
          this.synchroListe = response.data.synchronisations;
        }, error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }
  public GetAllPatrimoine() {
    this.patrimoineService
      .GetAllPatrimoine({})
      .subscribe({
        next: (response) => {
          this.dataSource = response['data'];
          this.listOperations = response['data'];
        }, error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }
  filterService(status) {
    this.filterStatus = status;
  }
}
