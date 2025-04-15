import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { MappingService } from '../../../../../shared/services/mapping.service';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BADGE_ETAT_FACTURE, T_BADGE_ETAT_FACTURE } from '../../../../../shared/constants/badge-etat-facture.contant';
import { invoiceApiResponseInterface, invoiceGlobalStatsInterface, invoiceInterface } from '../../data-access/invoice/interface/invoice.interface';
import { invoiceFilterInterface } from '../../data-access/invoice/interface/invoice-filter.interface';
import { InvoiceApiService } from '../../data-access/invoice/service/invoice-api.service';

const status_values = [BADGE_ETAT_FACTURE.POSTEE, BADGE_ETAT_FACTURE.REPORTEE, BADGE_ETAT_FACTURE.SOLDEE, BADGE_ETAT_FACTURE.REJETEE];
const indexBoxClickable = [2, 3, 4] as const;
type PageAction = { 'data': invoiceInterface, 'action': 'view-invoice', 'view': 'page' };

@Component({
    selector: `app-invoice`,
    templateUrl: `./invoice.component.html`,
    styles: [`.panels-p-dropdown p-dropdown {height: 100% !important; display: flex; align-items: center;}
            .boxClickable { cursor: pointer;}`]
})

export class InvoiceComponent implements OnInit, OnDestroy {

    public module: string;
    public subModule: string;
    public listStatusInvoice: Array<T_BADGE_ETAT_FACTURE> = status_values;
    public pagination$: Observable<Paginate<invoiceInterface>>;
    public listInvoicesResponse$: Observable<invoiceApiResponseInterface>;
    public listInvoices$: Observable<Array<invoiceInterface>>;
    public listOperations: Array<string> = [];
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public indexBoxClickable = indexBoxClickable;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private invoiceApiService: InvoiceApiService,
        private router: Router, private mappingService: MappingService) {
        this.listOperations = this.mappingService.listOperations;
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });

        this.listInvoices$ = this.invoiceApiService.getInvoice();
        this.listInvoicesResponse$ = this.invoiceApiService.getApiResponseInvoice();
        this.pagination$ = this.invoiceApiService.getInvoicePagination();
        combineLatest([
            this.invoiceApiService.getDataFilterInvoice(),
            this.invoiceApiService.getDataNbrPageInvoice()
        ]).subscribe(([filterData, nbrPageData]) => {
            this.invoiceApiService.fetchInvoice(filterData, nbrPageData);
        });
        this.invoiceApiService.isLoadingInvoice().pipe(takeUntil(this.destroy$)).subscribe((spinner: boolean) => {
            this.spinner = spinner;
        });
    }

    public filter(filterData: invoiceFilterInterface): void {
        this.invoiceApiService.fetchInvoice(filterData)
    }

    public onPageChange(event: number): void {
        this.invoiceApiService.getDataFilterInvoice().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.invoiceApiService.fetchInvoice(filterData, JSON.stringify(event + 1))
        });
    }

    public navigateByUrl(params: PageAction): void {
        const number_demand = params.data ? params.data["numero_demande"] : null;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case "view-invoice": routePath = `${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
        }
    }

    private getTchesBoxValues(rapport: invoiceGlobalStatsInterface | {} = {}): void {
        this.statistiquesBox = [
            {
                id: 0,
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Invoices',
                count: rapport?.["total_factures"] || 0,
                taux: rapport?.["pourcentage_factures"]
            },
            {
                id: 1,
                cardBgColor: 'rgb(254, 154, 46)',
                legend: '# Postés',
                count: rapport?.["total_postes"] || 0,
                taux: rapport?.["pourcentage_en_attentes"]
            },
            {
                id: 2,
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Reportés',
                count: rapport?.["total_reportes"] || 0,
                taux: rapport?.["pourcentage_immediats"] || 0
            },
            {
                id: 3,
                cardBgColor: '#27ae60',
                legend: '# Soldés',
                count: rapport?.["total_soldes"] || 0,
                taux: rapport?.["pourcentage_differes"] || 0
            },
            {
                id: 4,
                cardBgColor: '#e74c3c',
                legend: '# Rejetés',
                count: rapport?.["total_rejetes"] || 0,
                taux: rapport?.["pourcentage_immediats"] || 0
            }
        ];
    }

    public onBoxClick(statistiqueBox: IStatistiquesBox) {
        type IndexBoxClickable = (typeof indexBoxClickable)[number];
        if (indexBoxClickable.includes(statistiqueBox.id as IndexBoxClickable)) {
            switch (statistiqueBox.id) {
                case 2: this.invoiceApiService.fetchInvoice({ statut: "reportée" } as any); break;
                case 3: this.invoiceApiService.fetchInvoice({ statut: "soldée" } as any); break;
                case 4: this.invoiceApiService.fetchInvoice({ statut: "rejetée" } as any); break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}