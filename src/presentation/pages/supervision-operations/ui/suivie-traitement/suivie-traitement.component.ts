import { BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { StatutTransaction } from './../../../../../shared/enum/StatutTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import * as moment from 'moment';
import { ExcelService } from 'src/shared/services/excel.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SEARCH } from 'src/shared/routes/routes';
import { DemandeMasseComponent } from '../../feature/demande-masse/demande-masse.component';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
import { SuivieTraitementFilterStateService } from '../../data-access/suivie-traitement-filter-state.service';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { BADGE_STATUT } from 'src/shared/constants/badge-statut.constant';
import { TitleOperation } from '../../../../../shared/enum/OperationTransaction.enum';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-suivie-traitement',
    templateUrl: './suivie-traitement.component.html',
    styleUrls: ['./suivie-traitement.component.scss'],
})
export class SuivieTraitementComponent implements OnInit {
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    public listTraitemants: Array<any> = [];
    public listOperations: Array<any> = [];
    public listStatutTransactions: Array<any> = [];
    public listTraitementTransactions: Array<any> = [];
    public listUsers: Array<any> = [];
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public page: number = 0;
    public selectedTypeOperation: any;
    public selectedTransaction: any;
    public selectedStatut: any;
    public selectedTraitement: any;
    public selectedSim: string;
    public selectedimsi: string;
    public secondFilter: boolean = false;
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;
    public filterDateStart: Date;
    public filterDateEnd: Date;
    public selectDateStart: any;
    public selectDateEnd: any;
    public currentUser: any;
    public historie: any;
    public IsLoading: boolean;
    public title =
        'Suivi et traitements - Système de Gestion de Collecte Centralisée';

    constructor(
        private supervisionOperationService: SupervisionOperationService,
        private toastrService: ToastrService,
        private clipboardApi: ClipboardService,
        private modalService: NgbModal,
        private settingService: SettingService,
        private mappingService: MappingService,
        private excelService: ExcelService,
        private titleService: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private suivieTraitementFilterStateService: SuivieTraitementFilterStateService,
        private sharedDataService: SharedDataService
    ) {
        this.titleService.setTitle(`${this.title}`);
        this.listOperations = this.mappingService.listOperationTraitementVue;
        Object.values(StatutTransaction).forEach((item) => {
            this.listStatutTransactions.push(item);
        });
        Object.values(TraitementTransaction).forEach((item) => {
            this.listTraitementTransactions.push(item);
        });
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle =
            this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    }

    ngOnInit() {
        this.isFilter();
        this.getAllUsers();
        if (history.state) {
            this.historie = history.state;
            this.selectedStatut = this.historie?.statut;
            this.selectedTraitement = this.historie?.traitement;
        }
        this.sharedDataService
            .postPatrimoineSimTraitementsDemandesAll()
            .subscribe(() => {
                this.onFilter();
            });
        this.onFilter();
        this.GetAllTransactions();
    }

    public GetAllTransactions() {
        const data = {
            ...(this.historie?.statut ? { statut: this.selectedStatut } : {}),
            ...(this.historie?.traitement
                ? { traitement: this.selectedTraitement }
                : {}),
        };
        this.suivieTraitementFilterStateService.setFilterState(data);
        this.supervisionOperationService
            .GetAllTransactions(data, this.p)
            .subscribe({
                next: (response) => {
                    this.listTraitemants = response['data']['data'].map(
                        (data) => {
                            if (data?.statut === StatutTransaction.TARITER) {
                                return {
                                    ...data,
                                    current_date: data?.date_traitement,
                                };
                            } else if (
                                data?.statut === StatutTransaction.CLOTURER
                            ) {
                                return {
                                    ...data,
                                    current_date: data?.date_cloture,
                                };
                            } else if (
                                data?.statut === StatutTransaction.SOUMIS &&
                                data?.traitement ===
                                    TraitementTransaction.ACQUITER
                            ) {
                                return {
                                    ...data,
                                    current_date: data?.date_acquittement,
                                };
                            } else {
                                return { ...data, current_date: 'N/A' };
                            }
                        }
                    );
                    this.totalPage = response.data.last_page;
                    this.totalRecords = response.data.total;
                    this.recordsPerPage = response.data.per_page;
                    this.page = response.data?.current_page;
                    this.offset =
                        (response.data.current_page - 1) * this.recordsPerPage +
                        1;
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    public onFilter(): void {
        if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
            this.toastrService.error('Plage de date invalide');
            return;
        }
        const data = {
            operation: this.selectedTypeOperation,
            numero_demande: this.selectedTransaction,
            statut: this.selectedStatut,
            traitement: this.selectedTraitement,
            initie_par: this.currentUser?.id,
            msisdn: this.selectedSim,
            imsi: this.selectedimsi,
            date_debut: this.selectDateStart,
            date_fin: this.selectDateEnd,
        };
        this.suivieTraitementFilterStateService.setFilterState(data);
        this.supervisionOperationService
            .GetAllTransactions(data, this.p)
            .subscribe({
                next: (response) => {
                    this.listTraitemants = response['data']['data'].map(
                        (data) => {
                            if (data?.statut === StatutTransaction.TARITER) {
                                return {
                                    ...data,
                                    current_date: data?.date_traitement,
                                };
                            } else if (
                                data?.statut === StatutTransaction.CLOTURER
                            ) {
                                return {
                                    ...data,
                                    current_date: data?.date_cloture,
                                };
                            } else if (
                                data?.statut === StatutTransaction.SOUMIS &&
                                data?.traitement ===
                                    TraitementTransaction.ACQUITER
                            ) {
                                return {
                                    ...data,
                                    current_date: data?.date_acquittement,
                                };
                            } else {
                                return { ...data, current_date: 'N/A' };
                            }
                        }
                    );
                    this.totalPage = response['data'].last_page;
                    this.totalRecords = response['data'].total;
                    this.recordsPerPage = response['data'].per_page;
                    this.page = response.data?.current_page;
                    this.offset =
                        (response['data'].current_page - 1) *
                            this.recordsPerPage +
                        1;
                    // this.listTraitemants.length === 0 ?
                    //   Swal.fire('PATRIMOINE SIM', 'Aucune donnée pour cet Tenant', 'error')
                    //   : ''
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    getAllUsers() {
        this.settingService.getAllUsers({}).subscribe(
            (response: any) => {
                const users = response['data'];
                this.listUsers = users.map((el) => {
                    const data = { ...el, fullName: el.nom + ' ' + el.prenoms };
                    return data;
                });
            },
            (error) => {
                this.toastrService.error(error.error.message);
            }
        );
    }

    public getEtapeBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION:
                return 'badge-dark';
            case BADGE_ETAPE.TRAITEMENT:
                return 'badge-warning';
            case BADGE_ETAPE.FINALISATEUR:
                return 'badge-info';
            case BADGE_ETAPE.CLOTURE:
                return 'badge-success';
        }
    }

    public getEtatBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION:
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE)
                    return 'badge-dark';
                if (data?.traitement === BADGE_ETAT.REJETE)
                    return 'badge-danger';
                if (data?.traitement === BADGE_ETAT.APPROUVE)
                    return 'badge-success';
                if (data?.traitement === BADGE_ETAT.EN_COURS)
                    return 'badge-warning';
                if (data?.traitement === BADGE_ETAT.RECU) return 'badge-dark';
                break;

            case BADGE_ETAPE.TRAITEMENT:
                if (data?.traitement === BADGE_ETAT.EN_COURS)
                    return 'badge-warning';
                if (data?.traitement === BADGE_ETAT.TERMINE)
                    return 'badge-success';
                break;

            case BADGE_ETAPE.FINALISATEUR:
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return 'badge-warning';
                }
                if (data?.traitement === BADGE_ETAT.EFFECTUE) {
                    return 'badge-warning';
                }
                if (data?.traitement === BADGE_ETAT.LIVRE) {
                    return 'badge-primary';
                }
                break;

            case BADGE_ETAPE.CLOTURE:
                if (data?.traitement === BADGE_ETAT.EFFECTUE) {
                    return 'badge-success';
                }
                if (data?.traitement === BADGE_ETAT.TERMINE) {
                    return 'badge-success';
                }
                if (data?.traitement === BADGE_ETAT.REFUSE) {
                    return 'badge-danger';
                }
                if (data?.traitement === BADGE_ETAT.ABANDONNE) {
                    return 'badge-warning';
                }
                if (data?.traitement === BADGE_ETAT.REJETE) {
                    return 'badge-danger';
                }
                break;
        }
    }
    public onPageChange(event) {
        this.p = event;
        if (this.isFilter()) {
            this.GetAllTransactions();
        } else {
            this.onFilter();
        }
    }
    OnRefresh() {
        this.p = 1;
        this.historie = null;
        this.selectedTypeOperation = null;
        this.selectedTransaction = null;
        this.selectedStatut = null;
        this.selectedTraitement = null;
        this.currentUser = null;
        this.selectedSim = null;
        this.selectedimsi = null;
        this.selectDateStart = null;
        this.selectDateEnd = null;
        this.filterDateStart = null;
        this.filterDateEnd = null;
        this.GetAllTransactions();
        this.secondFilter = false;
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
                TraitementTransaction.ACCEPTER,
                TraitementTransaction.REFUSER,
                TraitementTransaction.ABANDONNER,
            ];
        } else {
            Object.values(TraitementTransaction).forEach((item) => {
                this.listTraitementTransactions.push(item);
            });
        }
    }
    public copyTransaction(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }
    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }
    public getCodeRapport(value: string): string {
        const code = value?.split('-');
        if (code[1] === '102') {
            return '102';
        } else if (code[1] === '100') {
            return '100';
        } else if (code[1] === '200') {
            return '200';
        } else {
            return 'false';
        }
    }
    public showDialog(data: Object): void {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons.fire({
            icon: 'info',
            html: `<strong>Message</strong> : ${data['message']} <br><br> <strong>Action</strong> : ${data['action']}`,
            confirmButtonColor: '#F07427',
            confirmButtonText: 'ok',
        });
    }
    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    }
    OnShowTraitement(data: any, paramUrl: string): void {
        this.router.navigate([SEARCH], {
            relativeTo: this.activatedRoute,
            queryParams: {
                view: paramUrl,
                // tenant: this.selectedTenant.nom_tenant,
                // code: this.selectedTenant.code,
                request: data?.numero_demande,
            },
        });
    }
    showJournal(data: Object): void {
        const modalRef = this.modalService.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande = data['numero_demande'];
        modalRef.componentInstance.typeJournal = 'demandes-services';
    }

    OnShowModalTraitement(data: any): void {
        let action: string;
        if (this.canClose(data)) {
            action = 'Clôturer';
        }
        this.IsLoading = true;
        const modalRef = this.modalService.open(
            DemandeMasseComponent,
            ModalParams
        );
        modalRef.componentInstance.params = {
            vue: 'traitement',
            action: action,
        };
        modalRef.componentInstance.demande = {
            ...data,
            current_date: data?.current_date,
            IsLoading: this.IsLoading,
        };
        modalRef.componentInstance.resultTraitement =
            this.supervisionOperationService.GetAllTransactions(
                this.suivieTraitementFilterStateService.getFilterState(),
                this.p
            );
        modalRef.componentInstance.IsLoading.subscribe((res) => {
            this.IsLoading = res;
            modalRef.componentInstance.IsLoadData = !res;
        });
    }

    // OnShowTraitement(data: any): void {
    //   this.IsLoading = true;
    //   const modalRef = this.modalService.open(TraitementShowComponent, {
    //     ariaLabelledBy: "modal-basic-title",
    //     backdrop: "static",
    //     keyboard: false,
    //     centered: true,
    //   });
    //   modalRef.componentInstance.transaction = {...data,current_date: data.current_date,IsLoading: this.IsLoading};
    //   modalRef.componentInstance.resultTraitement.subscribe((res) => {
    //     this.listTraitemants = res;
    //   })
    //   modalRef.componentInstance.IsLoading.subscribe((res) => {
    //     this.IsLoading = res;
    //     modalRef.componentInstance.IsLoadData = !res;
    //   })
    // }
    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }
    public disableAction(): boolean {
        return this.listTraitemants === undefined ||
            this.listTraitemants?.length === 0
            ? true
            : false;
    }
    public isFilter(): boolean {
        return !this.selectedTypeOperation &&
            !this.selectedTransaction &&
            !this.selectedStatut &&
            !this.currentUser &&
            !this.selectedSim &&
            !this.selectedimsi &&
            !this.selectedTraitement &&
            !this.filterDateStart &&
            !this.filterDateStart
            ? true
            : false;
    }

    changeDateStart(e) {
        if (moment(this.filterDateStart).isValid()) {
            this.selectDateStart = moment(this.filterDateStart).format(
                'YYYY-MM-DD'
            );
        } else {
            this.selectDateStart = null;
        }
    }
    changeDateEnd(e) {
        if (moment(this.filterDateEnd).isValid()) {
            this.selectDateEnd = moment(this.filterDateEnd).format(
                'YYYY-MM-DD'
            );
        } else {
            this.selectDateEnd = null;
        }
    }
    public OnExportExcel(): void {
        const data = this.listTraitemants.map((item: any) => ({
            'Date création': item?.created_at,
            'N° Dossier': item?.numero_demande,
            'N° Lignes': item?.transaction,
            '# Traitées': item?.nb_demande_traitees,
            Statut: item?.statut,
            Traitement: item?.traitement,
            'Date Traitement': item?.current_date,
            Demandeur: `${item.demandeur_nom} ${item.demandeur_prenoms}`,
        }));
        this.excelService.exportAsExcelFile(
            data,
            'Liste de suivi et traitements'
        );
    }

    public canClose(data: any): boolean {
        return (
            data?.statut === BADGE_ETAPE.FINALISATEUR &&
            data.traitement !== BADGE_ETAT.CLOTURE
        );
    }

    public getStyleButtonTraitement(data: any): Object {
        if (this.canClose(data)) {
            return {
                class: 'p-button-success',
                icon: 'pi pi-check-circle',
                tooltip: 'Clôturer',
            };
        } else {
            return {
                class: 'p-button-secondary',
                icon: 'pi pi-eye',
                tooltip: 'Détails demande',
            };
        }
    }

    public getDateTraitement(data: any): string {
        if (
            data?.traitement === BADGE_ETAT.RECU ||
            data?.statut === BADGE_ETAPE.SOUMISSION
        ) {
            return data?.acquitte_a;
        } else if (data?.statut === BADGE_ETAPE.TRAITEMENT) {
            return data?.traite_a;
        } else if (data?.statut === BADGE_ETAPE.CLOTURE) {
            return data?.cloture_a;
        } else if (data?.statut === BADGE_ETAPE.FINALISATEUR) {
            return data?.finalise_a;
        } else {
            ('N/A');
        }
    }
}
