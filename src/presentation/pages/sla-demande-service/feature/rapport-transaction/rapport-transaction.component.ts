import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { SlaDemandeService } from '../../data-access/sla-demande.service';
import { SettingService } from 'src/shared/services/setting.service';
import { ExcelService } from 'src/shared/services/excel.service';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-rapport-transaction',
    templateUrl: './rapport-transaction.component.html',
    styleUrls: ['./rapport-transaction.component.scss'],
})
export class RapportTransactionComponent implements OnInit {
    public module: string;
    public subModule: string;
    @Input() selectedTransaction: string;
    @Input() tabsLabel: string;
    @Output() rapport = new EventEmitter();
    public listTransactions: Array<any> = [];
    public listUsers: Array<any> = [];
    public listStatutTransactions: Array<any> = [];
    public selectedUser: any;
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
    public page: number = 1;
    date: Date | undefined;
    minDate: Date | undefined;
    maxDate: Date | undefined;
    dateToday: Date | undefined;

    public stateSoumis: string = StatutTransaction.SOUMIS;
    public stateTraite: string = StatutTransaction.TARITER;
    public stateCloture: string = StatutTransaction.CLOTURER;

    constructor(
        private toastrService: ToastrService,
        private route: ActivatedRoute,
        private clipboardApi: ClipboardService,
        private settingService: SettingService,
        private excelService: ExcelService,
        private slaDemandeService: SlaDemandeService
    ) {
        Object.values(StatutTransaction).forEach((item) => {
            this.listStatutTransactions.push(item);
        });
    }

    ngOnInit() {
        this.HandleSlaDemandeService();
        this.getAllUsers();
        this.isFilter();
        this.route.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });
        let currentDate = new Date();
        let prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 90);
        this.minDate = prevDate;
        this.maxDate = currentDate;
        this.dateToday = currentDate;
    }
    public HandleSlaDemandeService(): void {
        this.slaDemandeService
            .HandleSlaDemandeService(
                {
                    operation: this.selectedTransaction,
                },
                this.p
            )
            .subscribe({
                next: (response) => {
                    this.listTransactions = response['data']['data'][
                        'data'
                    ].map((data) => {
                        if (
                            data?.statut === StatutTransaction.TARITER ||
                            data?.statut === StatutTransaction.CLOTURER
                        ) {
                            return {
                                ...data,
                                statut: StatutTransaction.TARITER,
                                current_date: data?.date_traitement,
                                current_dure: data?.duree_traitement,
                                current_sla: data?.sla_traitement,
                            };
                        } else {
                            const dayDate = new Date();
                            const currentDate = new Date(data.created_at);
                            const timeDifference =
                                dayDate.getTime() - currentDate.getTime();
                            const secondsDifference = timeDifference / 1000;
                            const minutesDifference = secondsDifference / 60;
                            const hoursDifference = minutesDifference / 60;
                            return {
                                ...data,
                                current_date: 'N/A',
                                current_dure: hoursDifference.toFixed(1),
                                current_sla: data?.sla_traitement,
                            };
                        }
                    });
                    this.rapport.emit({
                        //Count
                        soumises: response['data']['soumises'],
                        traitees_dans_delais:
                            response['data']['traitees_dans_delais'],
                        traitees_hors_delais:
                            response['data']['traitees_hors_delais'],
                        attentes_hors_delais:
                            response['data']['attentes_hors_delais'],
                        sla_en_cours: response['data']['sla_en_cours'],
                        // Taux
                        pourcentage_soumises:
                            response['data']['pourcentage_soumises'],
                        pourcentage_traitees_dans_delais:
                            response['data'][
                                'pourcentage_traitees_dans_delais'
                            ],
                        pourcentage_traitees_hors_delais:
                            response['data'][
                                'pourcentage_traitees_hors_delais'
                            ],
                        pourcentage_attentes_hors_delais:
                            response['data'][
                                'pourcentage_attentes_hors_delais'
                            ],
                        pourcentage_sla_en_cours:
                            response['data']['pourcentage_sla_en_cours'],
                    });
                    this.totalPage = response['data']['data'].last_page;
                    this.totalRecords = response['data']['data'].total;
                    this.recordsPerPage = response['data']['data'].per_page;
                    this.page = response['data']['data'].current_page;
                    this.offset =
                        (response['data']['data'].current_page - 1) *
                            this.recordsPerPage +
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
            operation: this.selectedTransaction,
            initie_par: this.selectedUser.id,
            date_debut: this.selectDateStart,
            date_fin: this.selectDateEnd,
        };
        this.slaDemandeService.HandleSlaDemandeService(data, this.p).subscribe({
            next: (response) => {
                this.listTransactions = response['data']['data']['data'].map(
                    (data) => {
                        if (
                            data?.statut === StatutTransaction.TARITER ||
                            data?.statut === StatutTransaction.CLOTURER
                        ) {
                            return {
                                ...data,
                                statut: StatutTransaction.TARITER,
                                current_date: data?.date_traitement,
                                current_dure: data?.duree_traitement,
                                current_sla: data?.sla_traitement,
                            };
                        } else {
                            const dayDate = new Date();
                            const currentDate = new Date(data.created_at);
                            const timeDifference =
                                dayDate.getTime() - currentDate.getTime();
                            const secondsDifference = timeDifference / 1000;
                            const minutesDifference = secondsDifference / 60;
                            const hoursDifference = minutesDifference / 60;
                            return {
                                ...data,
                                current_date: 'N/A',
                                current_dure: hoursDifference.toFixed(1),
                                current_sla: data?.sla_traitement,
                            };
                        }
                    }
                );
                this.rapport.emit({
                    //Count
                    soumises: response['data']['soumises'],
                    traitees_dans_delais:
                        response['data']['traitees_dans_delais'],
                    traitees_hors_delais:
                        response['data']['traitees_hors_delais'],
                    attentes_hors_delais:
                        response['data']['attentes_hors_delais'],
                    sla_en_cours: response['data']['sla_en_cours'],
                    // Taux
                    pourcentage_soumises:
                        response['data']['pourcentage_soumises'],
                    pourcentage_traitees_dans_delais:
                        response['data']['pourcentage_traitees_dans_delais'],
                    pourcentage_traitees_hors_delais:
                        response['data']['pourcentage_traitees_hors_delais'],
                    pourcentage_attentes_hors_delais:
                        response['data']['pourcentage_attentes_hors_delais'],
                    pourcentage_sla_en_cours:
                        response['data']['pourcentage_sla_en_cours'],
                });
                this.totalPage = response['data']['data'].last_page;
                this.totalRecords = response['data']['data'].total;
                this.recordsPerPage = response['data']['data'].per_page;
                this.page = response['data']['data'].current_page;
                this.offset =
                    (response['data']['data'].current_page - 1) *
                        this.recordsPerPage +
                    1;
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    OnRefresh() {
        this.p = 1;
        this.HandleSlaDemandeService();
        this.selectedUser = null;
        this.selectDateStart = null;
        this.selectDateEnd = null;
        this.filterDateStart = null;
        this.filterDateEnd = null;
    }

    onPageChange(event: any) {
        this.p = event.pageCount;
        this.onFilter();
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

    copyData(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
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
    public isFilter(): boolean {
        return !this.selectedUser &&
            !this.selectDateStart &&
            !this.selectDateEnd
            ? true
            : false;
    }

    public disableAction(): boolean {
        return this.listTransactions === undefined ||
            this.listTransactions?.length === 0
            ? true
            : false;
    }
    public OnExportExcel(): void {
        const data = this.listTransactions.map((item: any) => ({
            Date: item?.created_at,
            'N° Dossier': item?.transaction,
            MSISDN: item?.msisdn,
            Demandeur: `${item?.demandeur_nom} ${item?.demandeur_prenoms}`,
            Statut: item?.statut,
            'Date Traitement': item?.current_date,
            'Durée Traitement (h)': item?.current_dure,
            'SLA (h)': item?.current_sla,
        }));
        this.excelService.exportAsExcelFile(
            data,
            `Liste des Rapport Performances - ${this.selectedTransaction}`
        );
    }
}
