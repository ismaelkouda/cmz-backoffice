import { LIST_AFFECTE, LIST_CODE_RAPPORT, LIST_OPERATIONS, LIST_TRAITEMENTS } from './../../../../../shared/constants/operations.constants';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { LocalStorageService } from 'ngx-webstorage';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-prise-en-charge',
  templateUrl: './prise-en-charge.component.html',
  styleUrls: ['./prise-en-charge.component.scss']
})
export class PriseEnChargeComponent implements OnInit {

  public listTraitemants: Array<any> = [];
  public listOperations: Array<any> = [];
  public listStatutTransactions: Array<any> = [];
  public listTraitementTransactions: Array<any> = [];
  public listIntervenants: Array<any> = [];
  public listAffectes: Array<any> = [];
  public listCodeRapports: Array<any> = [];
  public listTraitements: Array<any> = [];
  public listTenants: Array<any> = [];
  public listFirstLevel: Array<any> = [];
  public listSecondLevel: Array<any> = [];
  public selectedTypeOperation: any;
  public selectedTransaction: any;
  public selectedStatut: any;
  public selectedTraitement: any;
  public selectedFirstLevel: any;
  public selectedSecondLevel: any;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public selectedOperationSYN: boolean = false
  public secondFilter: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService
  ) {
    Object.values(OperationTransaction).forEach(item => {
      this.listOperations.push(item);
    });
    Object.values(StatutTransaction).forEach(item => {
      this.listStatutTransactions.push(item);
    });
    Object.values(TraitementTransaction).forEach(item => {
      this.listTraitementTransactions.push(item);
    });
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.GetFirstLevel();
    this.getAllUsers();
    this.isFilter();
    localStorage.setItem('layout', 'Barcelona');
  }

  public GetAllTransactions() {
    this.supervisionOperationService
      .GetAllTransactions({}, this.p)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onFilter(): void {
    const data = {
      transaction: this.selectedTransaction,
      statut: this.selectedStatut,
      traitement: this.selectedTraitement,
      niveau_un: this.selectedFirstLevel?.id,
      niveau_deux: this.selectedSecondLevel?.id,
    };
    this.supervisionOperationService
      .GetAllTransactions(data, this.p)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response['data']['data'];
          this.totalPage = response['data'].last_page;
          this.totalRecords = response['data'].total;
          this.recordsPerPage = response['data'].per_page;
          this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
          this.listTraitemants.length === 0 ?
            Swal.fire('PATRIMOINE SIM', 'Aucune donnée pour cet Tenant', 'error')
            : ''
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      });
  }
  OnRefresh() {
    this.GetAllTransactions();
    this.selectedTransaction = null;
    this.selectedStatut = null;
    this.selectedTraitement = null;
  }
  public GetFirstLevel() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listFirstLevel = response['data'].map(element => {
            return { ...element, fullName: `${element.nom} [${element.code}]` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onChangeItem(event: any) {
    this.selectedFirstLevel = event.value;
    this.listSecondLevel = this.selectedFirstLevel?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
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

  public getCodeRapport(value: string): string {
    const code = value?.split("-");
    if (code[1] === "102") {
      return "102";
    } else if (code[1] === "100") {
      return "100";
    } else if (code[1] === "200") {
      return "200";
    } else {
      return "false";
    }
  }

  public copyTransaction(data: any): void {
    console.log(data);
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  public isFilter(): boolean {
    return (!this.selectedTypeOperation &&
      !this.selectedFirstLevel &&
      !this.selectedSecondLevel &&
      !this.selectedTransaction &&
      !this.selectedStatut &&
      !this.selectedTraitement
    ) ? true : false
  }
}
