import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { MappingService } from 'src/shared/services/mapping.service';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
import { TitleOperation } from '../../../../../shared/enum/OperationTransaction.enum';

@Component({
    selector: 'app-show-notification',
    templateUrl: './show-notification.component.html',
    styleUrls: ['./show-notification.component.scss'],
})
export class ShowNotificationComponent implements OnInit {
    public module: string;
    public subModule: string;
    @Input() selectedOperation: string;
    @Input() currentData;
    @Output() showView = new EventEmitter();
    public selectedTransaction: string;
    public listTransactions: Array<any> = [];
    public listOperations: Array<any> = [];
    public listStatuts: Array<any> = [];
    public listTraitementTransactions: Array<any> = [];
    public selectedSim: string;
    public selectedimsi: string;
    public selectedStatut: string;
    public selectedTraitement: string;
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public page: number = 0;
    public display: boolean = false;
    public secondFilter: boolean = false;
    public filterDateStart: Date;
    public filterDateEnd: Date;
    public selectDateStart: any;
    public selectDateEnd: any;
    public stateSoumis: string = StatutTransaction.SOUMIS;
    public stateTraite: string = StatutTransaction.TARITER;
    public stateCloture: string = StatutTransaction.CLOTURER;
    public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
    public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
    public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
    public treatmenRejeter: string = TraitementTransaction.REJETER;
    public treatmenRefuser: string = TraitementTransaction.REFUSER;
    public treatmenCancel: string = TraitementTransaction.ABANDONNER;

    constructor(
        public settingService: SettingService,
        public patrimoineService: PatrimoineService,
        public toastrService: ToastrService,
        private clipboardApi: ClipboardService,
        private mappingService: MappingService,
        private modalService: NgbModal,
        private excelService: ExcelService
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
        if (this.currentData) {
            this.GetAllTransactions();
        }
        this.isFilter();
    }

    public GetAllTransactions() {
        this.patrimoineService
            .GetAllTransactions(
                {
                    numero_demande: this.currentData?.reference,
                    operation: this.currentData.type,
                    tenant_code: this.mappingService.tenant.tenant_code,
                },
                this.p
            )
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
        this.onFilter();
    }

    public onFilter() {
        if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
            this.toastrService.error('Plage de date invalide');
            return;
        }
        this.patrimoineService
            .GetAllTransactions(
                {
                    operation: this.selectedOperation,
                    transaction: this.selectedTransaction,
                    msisdn: this.selectedSim,
                    imsi: this.selectedimsi,
                    statut: this.selectedStatut,
                    traitement: this.selectedTraitement,
                    date_debut: this.selectDateStart,
                    date_fin: this.selectDateEnd,
                },
                this.p
            )
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
    public OnRefresh() {
        this.GetAllTransactions();
        this.selectedTransaction = null;
        this.selectedSim = null;
        this.selectedimsi = null;
        this.selectedStatut = null;
        this.selectedTraitement = null;
        this.selectDateStart = null;
        this.selectDateEnd = null;
        this.filterDateStart = null;
        this.filterDateEnd = null;
    }
    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    showJournal(data: Object): void {
        const modalRef = this.modalService.open(JournalComponent, ModalParams);
        modalRef.componentInstance.transaction = data;
        modalRef.componentInstance.type = data['ouvrage'];
    }

    copyData(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }
    close() {
        this.showView.emit(false);
    }
    public disableAction(): boolean {
        return this.listTransactions === undefined ||
            this.listTransactions?.length === 0
            ? true
            : false;
    }
    OnShowTraitement(data: Object): void {
        const modalRef = this.modalService.open(
            TransactionShowComponent,
            ModalParams
        );
        modalRef.componentInstance.transaction = data;
        modalRef.componentInstance.resultTraitement.subscribe((res) => {
            this.listTransactions = res;
        });
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
    public isFilter(): boolean {
        return !this.selectedSim &&
            !this.selectedimsi &&
            !this.selectedStatut &&
            !this.selectedTraitement &&
            !this.selectedTransaction
            ? true
            : false;
    }

    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }
    public OnExportExcel(): void {
        const data = this.listTransactions.map((item: any) => ({
            'Date Demande': item?.created_at,
            'N° Dossier': item?.transaction,
            'Date MAJ': item?.updated_at,
            IMSI: item?.imsi,
            MSISDN: item?.msisdn,
            Statut: item?.statut,
            Traitement: item?.traitement,
        }));
        this.excelService.exportAsExcelFile(data, 'Liste des transactions');
    }
}
