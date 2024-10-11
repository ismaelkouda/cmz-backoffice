import { TraitementTransaction } from "../../../../../../shared/enum/TraitementTransaction.enum";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ClipboardService } from "ngx-clipboard";
import { SupervisionOperationService } from "../../../data-access/supervision-operation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TraitementShowComponent } from '../../../../../../shared/components/traitement-show/traitement-show.component';
import { OperationTransaction } from "src/shared/enum/OperationTransaction.enum";
import { StatutTransaction } from "../../../../../../shared/enum/StatutTransaction.enum";
import { LoadingBarService } from "@ngx-loading-bar/core";
import * as moment from "moment";
import { JournalComponent } from "src/shared/components/journal/journal.component";
import { Title } from "@angular/platform-browser";
import { ExcelService } from "src/shared/services/excel.service";
import { SettingService } from "src/shared/services/setting.service";
import { SUPERVISION_OPERATIONS } from "../../../../../../shared/routes/routes";
import { ActivatedRoute, Router } from "@angular/router";
import { SUIVIE_TRAITEMENT_ROUTE } from "src/presentation/pages/supervision-operations/supervision-operations-routing.module";
import { ModalParams } from "src/shared/constants/modalParams.contant";
import { BADGE_ETAPE } from "src/shared/constants/badge-etape.constant";
import { BADGE_ETAT } from "src/shared/constants/badge-etat.contant";
import { BADGE_STATUT } from "src/shared/constants/badge-statut.constant";
const Swal = require("sweetalert2");

@Component({
  selector: "app-details-suivie-traitement",
  templateUrl: "./details-suivie-traitement.component.html",
  styleUrls: ["./details-suivie-traitement.component.scss"],
})
export class DetailsSuivieTraitementComponent implements OnInit {
  public listTraitemants: Array<any> = [];
  public listOperations: Array<any> = [];
  public listStatutTransactions: Array<any> = [];
  public listTraitementTransactions: Array<any> = [];
  public listTenants: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 1;
  // public selectedTypeOperation: any;
  public selectedTransaction: any;
  public selectedStatut: any;
  public selectedTraitement: any;
  public selectedTenant: any;
  public selectedSim: string;
  public selectedimsi: string;
  public secondFilter: boolean = false;
  public showIframe: boolean = false;
  public isMaximized: boolean = false;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public visualUrl: string;
  public IsLoading: boolean;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;
  public treatmenRefuser: string = TraitementTransaction.REFUSER;
  public title =
    "Details Suivi & Traitements - Système de Gestion de Collecte Centralisée";
  public requestNumber: string;
  // A Upprimer plus tart
  public ListTypeOperation = [{'libelle': 'Activation', 'code': 'activation'}]

  constructor(
    private settingService: SettingService,
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private loadingBar: LoadingBarService,
    private excelService: ExcelService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {
    Object.values(OperationTransaction).forEach((item) => {
      this.listOperations.push(item);
    });
    Object.values(StatutTransaction).forEach((item) => {
      this.listStatutTransactions.push(item);
    });
    Object.values(TraitementTransaction).forEach((item) => {
      this.listTraitementTransactions.push(item);
    });
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GetAllTenants();
    // this.isFilter();
    this.route.queryParams.subscribe((params) => {
      this.requestNumber = params["request"];
    });
    this.onFilter();
  }

  public onCloseDetailsTreatment() {
    this.router.navigate([
      SUPERVISION_OPERATIONS + "/" + SUIVIE_TRAITEMENT_ROUTE,
    ]);
  }

  public onFilter(): void {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error("Plage de date invalide");
      return;
    }
    const data = {
      // operation: this.selectedTypeOperation,
      transaction: this.selectedTransaction,
      numero_demande: this.requestNumber,
      statut: this.selectedStatut,
      traitement: this.selectedTraitement,
      msisdn: this.selectedSim,
      imsi: this.selectedimsi,
      date_debut: this.selectDateStart,
      date_fin: this.selectDateEnd,
    };
    this.supervisionOperationService
      .PostSupervisionOperationsTraitementsSuivisTransactions(data, this.p)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response["data"]["data"].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return { ...data, current_date: data?.date_traitement };
            } else if (data?.statut === StatutTransaction.CLOTURER) {
              return { ...data, current_date: data?.date_cloture };
            } else if (
              data?.statut === StatutTransaction.SOUMIS &&
              data?.traitement === TraitementTransaction.ACQUITER
            ) {
              return { ...data, current_date: data?.date_acquittement };
            } else {
              return { ...data, current_date: "N/A" };
            }
          });
          this.totalPage = response["data"].last_page;
          this.totalRecords = response["data"].total;
          this.recordsPerPage = response["data"].per_page;
          this.page = response.data?.current_page;
          this.offset =
            (response["data"].current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        },
      });
  }
  onPageChange(event: any) {
    this.p = event.pageCount;
    this.onFilter();
  }
  OnRefresh() {
    if (this.selectedTenant) {
      // this.selectedTypeOperation = null;
      this.selectedTransaction = null;
      this.selectedStatut = null;
      this.selectedTraitement = null;
      this.selectedSim = null;
      this.selectedimsi = null;
      this.selectDateStart = null;
      this.selectDateEnd = null;
      this.filterDateStart = null;
      this.filterDateEnd = null;
      this.onFilter();
    } else {
      this.loadingBar.start();
      setTimeout(() => {
        this.listTraitemants.splice(0, this.listTraitemants.length);
        // this.selectedTypeOperation = null;
        this.selectedTransaction = null;
        this.selectedStatut = null;
        this.selectedTraitement = null;
        this.selectedSim = null;
        this.selectedimsi = null;
        this.selectDateStart = null;
        this.selectDateEnd = null;
        this.filterDateStart = null;
        this.filterDateEnd = null;
        this.loadingBar.stop();
      }, 1000);
    }
  }

  public OnChangeStatut(event) {
    const currentStatut = event.value;
    if (currentStatut === StatutTransaction.SOUMIS) {
      this.listTraitementTransactions.splice(
        0,
        this.listTraitementTransactions.length
      );
      this.listTraitementTransactions = [
        TraitementTransaction.EN_ENTENTE,
        TraitementTransaction.ACQUITER,
      ];
    } else if (currentStatut === StatutTransaction.TARITER) {
      this.listTraitementTransactions.splice(
        0,
        this.listTraitementTransactions.length
      );
      this.listTraitementTransactions = [
        TraitementTransaction.ACCEPTER,
        TraitementTransaction.REJETER,
      ];
    } else if (currentStatut === StatutTransaction.CLOTURER) {
      this.listTraitementTransactions.splice(
        0,
        this.listTraitementTransactions.length
      );
      this.listTraitementTransactions = [
        TraitementTransaction.REFUSER,
        TraitementTransaction.ACCEPTER,
      ];
    } else {
      Object.values(TraitementTransaction).forEach((item) => {
        this.listTraitementTransactions.push(item);
      });
    }
  }
  public GetAllTenants() {
    // this.settingService.GetAllTenants({}, 1).subscribe({
    //   next: (response) => {
    //     this.listTenants = response["data"]["data"];
    //   },
    //   error: (error) => {
    //     this.toastrService.error(error.message);
    //   },
    // });
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public copyTransaction(data: any): void {
    this.toastrService.success("Copié dans le presse papier");
    this.clipboardApi.copyFromContent(data);
  }
  public formatTitle(title: string) {
    return this.supervisionOperationService.HandleFormatTitle(title);
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

  
  public getStatutBadge(statut: string): string {
    if(statut === BADGE_ETAPE.SOUMISSION || statut === BADGE_STATUT.SOUMIS) {
        return "badge-dark";
    } else if(statut === BADGE_ETAPE.TRAITEMENT) {
        return "badge-warning";
    } else if(statut === BADGE_ETAPE.FINALISATEUR || statut === BADGE_ETAPE.CLOTURE || statut === BADGE_STATUT.CLOTURE) {
        return "badge-success";
    } else if(statut === BADGE_STATUT.TRAITE) {
        return "badge-info";
    }
}

  

public getTraitementBadge(dossier: any): string {
  if (dossier?.traitement === BADGE_ETAT.RECU || (dossier?.statut === BADGE_ETAPE.SOUMISSION && dossier?.traitement === BADGE_ETAT.EN_ATTENTE) || (dossier?.statut === BADGE_ETAPE.TRAITEMENT && dossier?.traitement === BADGE_ETAT.EN_ATTENTE)) {
      return "badge-dark";
  } else if ((dossier?.statut === BADGE_ETAPE.TRAITEMENT && (dossier?.traitement === BADGE_ETAT.PARTIEL || dossier?.traitement === BADGE_ETAT.EN_ATTENTE)) ||
      (dossier?.statut === BADGE_ETAPE.CLOTURE && dossier?.traitement === BADGE_ETAT.ABANDONNE)) {
      return "badge-warning";
  } else if (dossier?.statut === BADGE_ETAPE.TRAITEMENT && dossier?.traitement === BADGE_ETAT.TOTAL) {
      return "badge-info";
  } else if ((dossier?.statut === BADGE_ETAPE.FINALISATEUR && dossier?.traitement === BADGE_ETAT.CLOTURE) ||
      (dossier?.statut === BADGE_ETAPE.CLOTURE && dossier?.traitement === BADGE_ETAT.ACCEPTE) || 
      (dossier?.statut === BADGE_ETAPE.FINALISATEUR && dossier?.traitement === BADGE_ETAT.PARTIEL)) {
      return "badge-success";
  } else if (dossier?.traitement === BADGE_ETAT.REJETE || dossier?.traitement === BADGE_ETAT.REFUSE) {
      return "badge-danger";
  }
}

  public showDialog(data: Object): void {
    console.log('data', data)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      icon: "info",
      html: `<strong>Message</strong> : ${data["message"]}</strong>`,
      confirmButtonColor: "#F07427",
      confirmButtonText: "ok",
    });
  }

  public truncateString(str: string, num: number = 20): string {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  copyData(data: any): void {
    this.toastrService.success("Copié dans le presse papier");
    this.clipboardApi.copyFromContent(data);
  }

  OnShowTraitement(data: any): void {
    this.IsLoading = true;
    const modalRef = this.modalService.open(TraitementShowComponent, ModalParams);
    modalRef.componentInstance.transaction = { ...data, current_date: data?.current_date, IsLoading: this.IsLoading };
    modalRef.componentInstance.resultTraitement.subscribe((res) => { this.listTraitemants = res; });
    modalRef.componentInstance.IsLoading.subscribe((res) => { this.IsLoading = res; 
      console.log('res', res)
    modalRef.componentInstance.IsLoadData = !res;
  });
  }

  showJournal(data: Object): void {
    const modalRef = this.modalService.open(JournalComponent, ModalParams);
    modalRef.componentInstance.transaction = data['transaction'];
    modalRef.componentInstance.typeJournal = "transactions"
  }
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  changeDateStart(e) {
    if (moment(this.filterDateStart).isValid()) {
      this.selectDateStart = moment(this.filterDateStart).format("YYYY-MM-DD");
    } else {
      this.selectDateStart = null;
    }
  }
  changeDateEnd(e) {
    if (moment(this.filterDateEnd).isValid()) {
      this.selectDateEnd = moment(this.filterDateEnd).format("YYYY-MM-DD");
    } else {
      this.selectDateEnd = null;
    }
  }
  public HandleAcquiter(data: any): void {
    // Swal.fire({
    //   title: "En êtes vous sûr ?",
    //   html: `La transaction ${data.transaction}<br> sera prise en charge !`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#569C5B",
    //   cancelButtonColor: "#dc3545",
    //   cancelButtonText: "Annuler",
    //   confirmButtonText: "Oui",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.supervisionOperationService
    //       .HandleAcquiter({
    //         tenant_code: this.selectedTenant?.code,
    //         transaction: data?.transaction,
    //       })
    //       .subscribe({
    //         next: (response) => {
    //           this.toastrService.success(response.message);
    //           this.onFilter();
    //         },
    //         error: (error) => {
    //           this.toastrService.error(error.error.message);
    //         },
    //       });
    //   }
    // });
  }
  public disableAction(): boolean {
    return this.listTraitemants === undefined || this.listTraitemants?.length === 0 ? true : false;
  }
  // public isFilter(): boolean {
  //   return !this.selectedTenant ? true : false;
  // }
  public OnExportExcel(): void {
    const data = this.listTraitemants.map((item: any) => ({
      "Date création": item?.created_at,
      "N° Dossier": item?.transaction,
      Service: item?.operation,
      Rapport: item?.code_rapport,
      Statut: item?.statut,
      Traitement: item?.traitement,
      "Date Traitement": item?.current_date,
      Demandeur: `${item.demandeur_nom} ${item.demandeur_prenoms}`,
    }));
    this.excelService.exportAsExcelFile(data, "Liste de suivi et traitements");
  }
}
