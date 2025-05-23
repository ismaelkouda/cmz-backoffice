import { DemandeMasseComponent } from './../../../supervision-operations/feature/demande-masse/demande-masse.component';
import { BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { DemandeService } from '../../data-access/demande.service';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
import { DemandesFilterStateService } from '../../data-access/demandes-filter-state.service';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TypePaiementComponent } from '../type-paiement/type-paiement.component';
import { SettingService } from '../../../../../shared/services/setting.service';
type PageAction = { data: Object; action: 'facture'; view: 'page' };
@Component({
    selector: 'app-demande-wrapper',
    templateUrl: './demande-wrapper.component.html',
    styleUrls: ['./demande-wrapper.component.scss'],
})
export class DemandeWrapperComponent implements OnInit {
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    public module: string;
    public subModule: string;
    @Input() selectedOperation: string;
    @Input() wrapperLabel: string;
    @Input() listTransactions: any;
    @Output() formsView = new EventEmitter();
    @Output() typeDemande = new EventEmitter<string>();
    @Output() transactionId = new EventEmitter();
    @Output() currentObject = new EventEmitter();
    @Output() interfaceUser = new EventEmitter<PageAction>();

    public listStatuts: Array<any> = [];
    public selectedTransaction: string;
    public selectedTransactionShow: string;
    public listOperations: Array<any> = [];
    public listUsers: Array<any> = [];
    public listTraitementTransactions: Array<any> = [];
    public initialView: boolean = true;
    public selectedSim: string;
    public selectedimsi: string;
    public selectedStatut: string;
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public page: number = 0;
    public display: boolean = false;
    public isMaximized: boolean = false;
    public secondFilter: boolean = false;
    public currentUser: any;
    public filterDateStart: Date;
    public filterDateEnd: Date;
    public selectDateStart: any;
    public selectDateEnd: any;
    public IsLoading: boolean;
    public visibleFormTypePaiement: boolean = false;

    constructor(
        public settingService: SettingService,
        public demandeService: DemandeService,
        public toastrService: ToastrService,
        private clipboardApi: ClipboardService,
        public mappingService: MappingService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private excelService: ExcelService,
        private demandesFilterStateService: DemandesFilterStateService,
        private sharedDataService: SharedDataService,
        private loadingBarService: LoadingBarService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.listOperations = this.mappingService.listOperations;
        Object.values(StatutTransaction).forEach((item) => {
            this.listStatuts.push(item);
        });
        Object.values(TraitementTransaction).forEach((item) => {
            this.listTraitementTransactions.push(item);
        });
    }

    ngOnInit() {
        this.sharedDataService
            .postPatrimoineSimDemandesServicesAll()
            .subscribe(() => {
                this.GetAllTransactions();
            });
        this.GetAllTransactions();
        this.isFilter();
        this.disableAction();
        this.GetAllUsers();
        this.route.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[3];
        });
        if (history.state.patrimoine) {
            this.onInitForm('simple');
        }
        if (history.state?.statut || history.state?.traitement) {
            this.selectedStatut = history.state?.statut;
        }
    }
    public onAction(params: PageAction): void {
        switch (params.view) {
            case 'page':
                this.navigateByUrl(params);
                break;
        }
    }

    public navigateByUrl(params: PageAction): void {
        const data = {
            numero_demande: this.selectedTransaction,
            transaction: this.selectedTransactionShow,
            operation: this.selectedOperation,
            initie_par: this.currentUser?.id,
            statut: this.selectedStatut,
            date_debut: this.selectDateStart,
            date_fin: this.selectDateEnd,
        };
        const numero_demande = params.data['numero_demande'];
        const ref = params.action;
        const current_page = this.page || 1;

        const queryParams = {
            ref,
            current_page,
        };

        let routePath: string;

        switch (params.action) {
            case 'facture':
                routePath = `${numero_demande}`;
                break;
        }

        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    OnShowModalTraitement(data: any): void {
        let action: string;
        if (
            data?.statut === this.BADGE_ETAPE.SOUMISSION &&
            data.traitement === this.BADGE_ETAT.EN_ATTENTE
        ) {
            action = 'Abandonner';
        } else {
            action = 'Identifier';
        }
        this.IsLoading = true;
        const modalRef = this.modalService.open(
            DemandeMasseComponent,
            ModalParams
        );
        modalRef.componentInstance.params = {
            vue: data.operation,
            action: action,
        };
        modalRef.componentInstance.demande = {
            ...data,
            current_date: data?.current_date,
            IsLoading: this.IsLoading,
        };
        modalRef.componentInstance.resultTraitement =
            this.demandeService.GetDemandeServiceByTransaction(
                this.demandesFilterStateService.getFilterState(),
                this.p
            );
        modalRef.componentInstance.IsLoading.subscribe((res) => {
            this.IsLoading = res;
            modalRef.componentInstance.IsLoadData = !res;
        });
    }

    public getColorActionButton(facture: Object): Object {
        if (!!facture?.['type_paiement']) {
            return { style: 'badge-success', value: facture?.['etat_facture'] };
        } else {
            return { style: 'badge-danger', value: facture?.['etat_facture'] };
        }
    }

    OnShowModalPaiement(data: any): void {
        let action: string;
        if (
            data?.statut === this.BADGE_ETAPE.SOUMISSION &&
            data.traitement === this.BADGE_ETAT.EN_ATTENTE
        ) {
            action = 'Abandonner';
        } else {
            action = 'Identifier';
        }
        this.IsLoading = true;
        const modalRef = this.modalService.open(
            TypePaiementComponent,
            ModalParams
        );
        modalRef.componentInstance.params = {
            vue: 'Abonnement',
            action: action,
        };
        modalRef.componentInstance.demandeSelected = {
            ...data,
            current_date: data?.current_date,
            IsLoading: this.IsLoading,
        };
        modalRef.componentInstance.resultTraitement =
            this.demandeService.GetDemandeServiceByTransaction(
                this.demandesFilterStateService.getFilterState(),
                this.p
            );
        modalRef.componentInstance.IsLoading.subscribe((res) => {
            this.IsLoading = res;
            modalRef.componentInstance.IsLoadData = !res;
        });
    }

    public GetAllTransactions() {
        const data = {
            operation: this.selectedOperation,
            ...(history.state?.statut ? { statut: history.state?.statut } : {}),
            ...(history.state?.traitement
                ? { traitement: history.state?.traitement }
                : {}),
        };
        this.demandesFilterStateService.setFilterState(data);
        this.demandeService
            .GetDemandeServiceByTransaction(data, this.p)
            .subscribe({
                next: (response) => {
                    this.listTransactions = response['data']['data'].map(
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

    public onPageChange(event) {
        this.p = event;
        if (this.isFilter()) {
            this.GetAllTransactions();
        } else {
            this.onFilter();
        }
    }

    public onFilter() {
        if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
            this.toastrService.error('Plage de date invalide');
            return;
        }
        const data = {
            numero_demande: this.selectedTransaction,
            transaction: this.selectedTransactionShow,
            operation: this.selectedOperation,
            initie_par: this.currentUser?.id,
            statut: this.selectedStatut,
            date_debut: this.selectDateStart,
            date_fin: this.selectDateEnd,
        };
        this.demandesFilterStateService.setFilterState(data);
        this.loadingBarService.start();
        this.demandeService
            .GetDemandeServiceByTransaction(data, this.p)
            .subscribe({
                next: (response) => {
                    this.listTransactions = response['data']['data'].map(
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
                    this.loadingBarService.complete();
                    this.totalPage = response.data.last_page;
                    this.totalRecords = response.data.total;
                    this.recordsPerPage = response.data.per_page;
                    this.page = response.data?.current_page;
                    this.offset =
                        (response.data.current_page - 1) * this.recordsPerPage +
                        1;
                },
                error: (error) => {
                    this.loadingBarService.stop();
                    this.toastrService.error(error.error.message);
                },
            });
    }

    public OnRefresh() {
        this.p = 1;
        this.GetAllTransactions();
        this.selectedTransaction = null;
        this.selectedTransactionShow = null;
        this.currentUser = null;
        this.selectedStatut = null;
        this.selectDateStart = null;
        this.selectDateEnd = null;
        this.filterDateStart = null;
        this.filterDateEnd = null;
    }
    GetAllUsers() {
        this.loadingBarService.start();
        this.settingService.getAllUsers({}).subscribe(
            (response: any) => {
                const users = response['data'];
                this.listUsers = users.map((el) => {
                    const data = { ...el, fullName: el.nom + ' ' + el.prenoms };
                    return data;
                });
                this.loadingBarService.complete();
            },
            (error) => {
                this.loadingBarService.stop();
                this.toastrService.error(error.error.message);
            }
        );
    }

    showJournal(data: Object): void {
        const modalRef = this.modalService.open(JournalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            backdrop: 'static',
            keyboard: false,
            centered: true,
        });
        modalRef.componentInstance.numero_demande = data['numero_demande'];
        modalRef.componentInstance.typeJournal = 'demandes-services';
    }

    copyData(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }

    public hideDialog(data) {
        this.display = false;
    }

    public onDialogMaximized(event) {
        event.maximized
            ? (this.isMaximized = true)
            : (this.isMaximized = false);
    }
    public onInitForm(type: string, data: any = null): void {
        this.formsView.emit(true);
        this.typeDemande.emit(type);
        if (data) this.currentObject.emit(data);
    }

    hideDialogTypePaiement() {
        this.visibleFormTypePaiement = false;
    }

    OnShowTraitement(data: any): void {
        this.transactionId.emit(data);
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

    public disableAction(): boolean {
        return this.listTransactions === undefined ||
            this.listTransactions?.length === 0
            ? true
            : false;
    }
    public isFilter(): boolean {
        return !this.selectedStatut &&
            !this.selectedTransaction &&
            !this.selectedTransactionShow
            ? true
            : false;
    }
    public OnExportExcel(): void {
        const data = this.listTransactions.map((item: any) => {
            const identifiedLabel =
                this.wrapperLabel === 'Demandes Abonnements'
                    ? '# Identifiées'
                    : '';
            const identifiedValue =
                this.wrapperLabel === 'Demandes Abonnements'
                    ? item?.nb_demande_identifiees
                    : '';

            return {
                'Date demande': item?.created_at,
                'N° Dossier': item?.numero_demande,
                '# Lignes': item?.nb_demande_soumises,
                '# Traitées': item?.nb_demande_traitees,
                [identifiedLabel]: identifiedValue,
                Statut: item?.statut,
                Traitement: item?.traitement,
                Demandeur: `${item?.demandeur_nom} ${item?.demandeur_prenoms}`,
            };
        });

        this.excelService.exportAsExcelFile(
            data,
            `Liste des demandes [${this.selectedOperation}]`
        );
    }
    public getStyleButtonTraitement(data: any): Object {
        if (data.traitement === BADGE_ETAT.REJETE) {
            return {
                class: 'p-button-success',
                icon: 'pi pi-check',
                tooltip: 'Identifier',
            };
        } else {
            return {
                class: 'p-button-secondary',
                icon: 'pi pi-eye',
                tooltip: 'Détails demande',
            };
        }
        // if (data?.statut === BADGE_ETAPE.SOUMISSION && data.traitement === BADGE_ETAT.EN_ATTENTE) {
        //   return { class: 'p-button-danger', icon: 'pi pi-times', tooltip: 'Abandonner' };
        // } else if (data?.statut === BADGE_ETAPE.FINALISATEUR) {
        //   return { class: 'p-button-success', icon: 'pi pi-check', tooltip: 'Identifier' };
        // } else {
        // return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande' };
        // }
    }
    // public getStyleButtonTraitement(dossier: any): Object {
    //     switch (dossier?.statut) {

    //         case BADGE_ETAPE.SOUMISSION:
    //             if (dossier?.traitement === BADGE_ETAT.RECU) {
    //                 return { class: 'p-button-success', icon: 'pi pi-check-circle', tooltip: 'Traiter', isViewMode: 'voir' };
    //             }
    //         break;

    //         case BADGE_ETAPE.TRAITEMENT:
    //             if (dossier?.traitement === BADGE_ETAT.EN_ATTENTE) {
    //                 return { class: 'p-button-success', icon: 'pi pi-check-circle', tooltip: 'Traiter', isViewMode: {traiter: 'traiter', finaliser: '' }};
    //             } else if (dossier?.traitement === BADGE_ETAT.PARTIEL) {
    //                 return { class: 'p-button-success', icon: 'pi pi-check-circle', tooltip: 'Traiter', isViewMode: {traiter: 'traiter', finaliser: 'finaliser' }};
    //             } else if (dossier?.traitement === BADGE_ETAT.TOTAL) {
    //                 return { class: 'p-button-success', icon: 'pi pi-check-circle', tooltip: 'Finaliser', isViewMode: {traiter: '', finaliser: 'finaliser' } };
    //             } else if (dossier?.traitement === BADGE_ETAT.REJETE) {
    //                 return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande', isViewMode: {traiter: '', finaliser: '' } };
    //             }
    //         break;

    //         case BADGE_ETAPE.FINALISATEUR:
    //             if (dossier?.traitement === BADGE_ETAT.PARTIEL) {
    //                 return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande', isViewMode: '' };
    //             } else if (dossier?.traitement === BADGE_ETAT.CLOTURE) {
    //                 return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande', isViewMode: '' };
    //             }
    //         break;

    //         case BADGE_ETAPE.CLOTURE:
    //             if (dossier?.traitement === BADGE_ETAT.TERMINE) {
    //                 return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande', isViewMode: '' };
    //             } else if (dossier?.traitement === BADGE_ETAT.REFUSE) {
    //                 return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande', isViewMode: '' };
    //             }
    //         break;
    //     }

    // }

    public disabledFolderButton(data): boolean {
        if (
            data?.statut == BADGE_ETAPE.FINALISATEUR ||
            data?.statut == BADGE_ETAPE.CLOTURE
        ) {
            return false;
        }
        return true;
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
                if (data?.traitement === BADGE_ETAT.APPROUVE)
                    return 'badge-success';
                if (data?.traitement === BADGE_ETAT.REJETE)
                    return 'badge-danger';
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
}
