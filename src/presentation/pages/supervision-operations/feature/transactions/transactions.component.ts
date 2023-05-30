import { PatrimoineService } from './../../../patrimoine/data-access/patrimoine.service';
import { ToastrService } from 'ngx-toastr';
import { SupervisionOperationService } from './../../data-access/supervision-operation.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  public activationsListe: Array<any> = [];
  public datasSourceListe: Array<any> = [];
  public parametresListe: Array<any> = [];
  public securitesListe: Array<any> = [];
  public synchroListe: Array<any> = [];
  public listOperations: Array<any> = [];
  public dataSource: Array<any> = [];
  public filterStatus: string;
  public filtreSelected: string;

  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private patrimoineService: PatrimoineService,
  ) {
    this.filterStatus = 'all';
    this.filtreSelected = 'Patrimoine SIM';
  }

  ngOnInit() {
    this.GetAllTrnasactions();
    this.GetAllPatrimoine();
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
    console.log(this.filtreSelected);
    this.filterStatus = status;
    if (status === 'all') {
      this.filtreSelected = 'Patrimoine SIM';
      this.listOperations = this.dataSource;
    } else if (status === 'synchronisation') {
      this.filtreSelected = 'Synchronisation';
      this.listOperations = this.synchroListe;
    } else if (status === 'prametre_collecte') {
      this.filtreSelected = 'Paramètres collecte';
      this.listOperations = this.parametresListe;
    } else if (status === 'activations') {
      this.filtreSelected = 'Activations';
      this.listOperations = this.activationsListe;
    } else if (status === 'securite') {
      this.filtreSelected = 'Sécurité';
      this.listOperations = this.securitesListe;
    }
  }
}
