import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
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
  public listFirstLevel: Array<any> = [];
  public listSecondLevel: Array<any> = [];
  public selectedTypeOperation: any;
  public selectedTransaction: any;
  public selectedStatut: any;
  public selectedFirstLevel: any;
  public selectedSecondLevel: any;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public secondFilter: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public title = 'Prises en charge - Système de Gestion de Collecte Centralisée';

  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
    this.listOperations = this.mappingService.listOperationTraitementVue;
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
    this.GetAllPriseEnCharge()
    this.GetFirstLevel();
    this.getAllUsers();
    this.isFilter();
  }

  public GetAllPriseEnCharge() {
    this.supervisionOperationService
      .GetAllPriseEnCharge({}, this.p)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onFilter(): void {
    const data = {
      operation: this.selectedTypeOperation,
      transaction: this.selectedTransaction,
      statut: this.selectedStatut,
      niveau_un: this.selectedFirstLevel?.id,
      niveau_deux: this.selectedSecondLevel?.id,
      date_debut: this.selectDateStart,
      date_fin: this.selectDateEnd,
    };
    this.supervisionOperationService
      .GetAllPriseEnCharge(data, this.p)
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
    this.GetAllPriseEnCharge();
    this.selectedTypeOperation = null
    this.selectedTransaction = null;
    this.selectedStatut = null;
    this.selectedFirstLevel = null;
    this.selectedSecondLevel = null
    this.selectDateStart = null;
    this.selectDateEnd = null;  
  }
  public GetFirstLevel() {
    this.settingService
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listFirstLevel = response['data'].map(element => {
            return { ...element, fullName: `${element.nom} [${element.code}]` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
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
          this.toastrService.error(error.error.message);
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
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  public isFilter(): boolean {
    return (
      !this.selectedTypeOperation &&
      !this.selectedFirstLevel &&
      !this.selectedSecondLevel &&
      !this.selectedTransaction &&
      !this.selectedStatut  &&
      !this.filterDateStart &&
      !this.filterDateStart 
    ) ? true : false
  }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }
}
