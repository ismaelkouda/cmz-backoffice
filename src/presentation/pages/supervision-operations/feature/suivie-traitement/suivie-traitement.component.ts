import { LIST_AFFECTE, LIST_CODE_RAPPORT, LIST_OPERATIONS, LIST_TRAITEMENTS } from './../../../../../shared/constants/operations.constants';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { LocalStorageService } from 'ngx-webstorage';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-suivie-traitement',
  templateUrl: './suivie-traitement.component.html',
  styleUrls: ['./suivie-traitement.component.scss']
})
export class SuivieTraitementComponent implements OnInit {

  public listPriseEncharges: Array<any> = [];
  public listDirectionsRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listIntervenants: Array<any> = [];
  public listActivations: Array<any> = [];
  public listOperations: Array<any> = [];
  public listAffectes: Array<any> = [];
  public listCodeRapports: Array<any> = [];
  public listTraitements: Array<any> = [];

  public selectedTypeOperation: any;
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedTransaction: any;
  public selectedIntervenant: any;
  public selectedTraitement: any;
  public selectedRapport: any;

  public selectedOperationSYN: boolean = false
  public secondFilter: boolean = false;

  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,

  ) {
    this.listOperations = LIST_OPERATIONS;
    this.listAffectes = LIST_AFFECTE;
    this.listCodeRapports = LIST_CODE_RAPPORT;
    this.listTraitements = LIST_TRAITEMENTS;

  }

  ngOnInit() {
    this.getAllDirectionRegionales();
    this.getAllExploiatations();
    this.getAllUsers();
    this.isFilter();
    localStorage.setItem('layout', 'Barcelona');
  }

  public getAllDirectionRegionales(): void {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirectionsRegionales = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }

  public getAllExploiatations(): void {
    this.settingService
      .getAllExploiatations({})
      .subscribe({
        next: (response) => {
          this.listExploitations = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }
  public getAllUsers(): void {
    this.settingService
      .getAllUsers({})
      .subscribe({
        next: (response) => {
          this.listIntervenants = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }

  onChangeItem(value, type) {
    this.selectedDirection = value;
    this.listExploitations = value?.exploitations
  }
  public onFilter(): void {
    const data = {
      operation: this.selectedTypeOperation?.code,
      niveau_un_id: this.selectedDirection?.id,
      niveau_deux_id: this.selectedExploitation?.id,
      transaction: this.selectedTransaction,
      intervenant_id: this.selectedIntervenant?.id,
      rapport: this.selectedRapport,
      traitement: this.selectedTraitement,
    };
    this.supervisionOperationService
      .GetAllPriseEnCharge(data)
      .subscribe({
        next: (response) => {
          this.listPriseEncharges = response['data'];
          this.listPriseEncharges.length === 0 ?
            Swal.fire('PATRIMOINE SIM', 'Aucune donnée pour cet exploitation', 'error')
            : ''
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      });
  }

  public copyTransaction(data: any): void {
    console.log(data);
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  isFilter(): boolean {
    return
  }
}

