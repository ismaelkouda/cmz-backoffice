import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { MappingService } from '../../../../../shared/services/mapping.service';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import {
    BADGE_ETAT_FACTURE,
    T_BADGE_ETAT_FACTURE,
} from '../../../../../shared/constants/badge-etat-facture.contant';
import {
    paymentApiResponseInterface,
    paymentGlobalStatsInterface,
    paymentInterface,
} from '../../data-access/payment/interface/payment.interface';
import { paymentFilterInterface } from '../../data-access/payment/interface/payment-filter.interface';
import { PaymentApiService } from '../../data-access/payment/service/payment-api.service';

const status_values = [
    BADGE_ETAT_FACTURE.POSTEE,
    BADGE_ETAT_FACTURE.REPORTEE,
    BADGE_ETAT_FACTURE.SOLDEE,
    BADGE_ETAT_FACTURE.REJETEE,
];
const indexBoxClickable = [1, 2, 3, 4] as const;
type PageAction = {
    data: paymentInterface;
    action: 'view-payment';
    view: 'page';
};

@Component({
    selector: `app-payment`,
    templateUrl: `./payment.component.html`,
    styles: [
        `
            .panels-p-dropdown p-dropdown {
                height: 100% !important;
                display: flex;
                align-items: center;
            }
            .boxClickable {
                cursor: pointer;
            }
        `,
    ],
})
export class PaymentComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public listStatusPayment: Array<T_BADGE_ETAT_FACTURE> = status_values;
    public pagination$: Observable<Paginate<paymentInterface>>;
    public listPaymentResponse$: Observable<paymentApiResponseInterface>;
    public listPayments$: Observable<Array<paymentInterface>>;
    public listOperations: Array<string> = [];
    public statisticsBox: Array<IStatistiquesBox> = [];
    public indexBoxClickable = indexBoxClickable;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private paymentApiService: PaymentApiService,
        private router: Router,
        private mappingService: MappingService
    ) {
        this.listOperations = this.mappingService.listOperations;
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });

        this.listPayments$ = this.paymentApiService.getPayment();
        this.listPaymentResponse$ =
            this.paymentApiService.getApiResponsePayment();
        this.pagination$ = this.paymentApiService.getPaymentPagination();
        this.paymentApiService
            .getPaymentGlobalState()
            .pipe(takeUntil(this.destroy$))
            .subscribe((globalState) => {
                this.getStatisticsBoxValues(globalState);
            });
        combineLatest([
            this.paymentApiService.getDataFilterPayment(),
            this.paymentApiService.getDataNbrPagePayment(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.paymentApiService.fetchPayment(filterData, nbrPageData);
        });
        this.paymentApiService
            .isLoadingPayment()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: paymentFilterInterface): void {
        this.paymentApiService.fetchPayment(filterData);
    }

    public onPageChange(event: number): void {
        this.paymentApiService
            .getDataFilterPayment()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.paymentApiService.fetchPayment(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public navigateByUrl(params: PageAction): void {
        const number_demand = params.data
            ? params.data['numero_demande']
            : null;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case 'view-payment':
                routePath = `${number_demand}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
        }
    }

    private getStatisticsBoxValues(
        rapport: paymentGlobalStatsInterface | {} = {}
    ): void {
        this.statisticsBox = [
            {
                id: 0,
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Paiements',
                count: rapport?.['total_factures'] || 0,
                taux: rapport?.['pourcentage_factures'],
            },
            {
                id: 1,
                cardBgColor: 'rgb(254, 154, 46)',
                legend: '# Postés',
                count: rapport?.['total_postes'] || 0,
                taux: rapport?.['pourcentage_en_attentes'],
            },
            {
                id: 2,
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Reportés',
                count: rapport?.['total_reportes'] || 0,
                taux: rapport?.['pourcentage_immediats'] || 0,
            },
            {
                id: 4,
                cardBgColor: '#e74c3c',
                legend: '# Rejetés',
                count: rapport?.['total_rejetes'] || 0,
                taux: rapport?.['pourcentage_immediats'] || 0,
            },
        ];
    }

    public onBoxClick(statistiqueBox: IStatistiquesBox) {
        type IndexBoxClickable = typeof indexBoxClickable[number];
        if (
            indexBoxClickable.includes(statistiqueBox.id as IndexBoxClickable)
        ) {
            switch (statistiqueBox.id) {
                case 1:
                    this.paymentApiService.fetchPayment({
                        statut: 'postée',
                    } as any);
                    break;
                case 2:
                    this.paymentApiService.fetchPayment({
                        statut: 'reportée',
                    } as any);
                    break;
                case 3:
                    this.paymentApiService.fetchPayment({
                        statut: 'soldée',
                    } as any);
                    break;
                case 4:
                    this.paymentApiService.fetchPayment({
                        statut: 'rejetée',
                    } as any);
                    break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
