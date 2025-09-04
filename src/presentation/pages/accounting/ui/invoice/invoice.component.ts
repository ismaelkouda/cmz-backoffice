import {
    NOTIFICATIONS_CENTER_STATE_ENUM,
    T_NOTIFICATIONS_CENTER_STATE_ENUM,
} from './../../../overseeing-operations/data-access/notifications-center/enums/notifications-center-state.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';
import { InvoiceInterface } from '../../data-access/invoice/interface/invoice.interface';
import { InvoiceFilterInterface } from '../../data-access/invoice/interface/invoice-filter.interface';
import { InvoiceApiService } from '../../data-access/invoice/service/invoice-api.service';
import { INVOICE_BUTTONS_ACTIONS_ENUM } from '../../data-access/invoice/enums/invoice-buttons-actions.enum';
import { InvoicePageActionsType } from '../../data-access/invoice/types/invoice-page-actions.type';
import {
    LIST_REQUESTS_SERVICE,
    T_LIST_REQUESTS_SERVICE,
} from '../../../../../shared/enum/list-requests-service';
import { InvoiceNavigationGuardService } from '../../data-access/invoice/service/invoice-navigation-guard.service';

@Component({
    selector: `app-invoice`,
    templateUrl: `./invoice.component.html`,
})
export class InvoiceComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<InvoiceInterface>>;
    public listInvoices$: Observable<Array<InvoiceInterface>>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listInvoiceState: Array<T_NOTIFICATIONS_CENTER_STATE_ENUM> =
        Object.values(NOTIFICATIONS_CENTER_STATE_ENUM);
    public listOperations: Array<T_LIST_REQUESTS_SERVICE> = Object.values(
        LIST_REQUESTS_SERVICE
    );

    constructor(
        private activatedRoute: ActivatedRoute,
        private invoiceApiService: InvoiceApiService,
        private router: Router,
        private navigationGuardService: InvoiceNavigationGuardService
    ) {
        this.setupNavigationListener();
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.listInvoices$ = this.invoiceApiService.getInvoice();
        this.pagination$ = this.invoiceApiService.getInvoicePagination();

        combineLatest([
            this.invoiceApiService.getDataFilterInvoice(),
            this.invoiceApiService.getDataNbrPageInvoice(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.invoiceApiService.fetchInvoice(filterData, nbrPageData);
        });
        this.invoiceApiService
            .isLoadingInvoice()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }
    private setupNavigationListener(): void {
        this.navigationGuardService
            .getInvoiceNavigationGuard()
            .pipe(
                takeUntil(this.destroy$),
                filter(
                    (params) =>
                        params !== null &&
                        params.action !== undefined &&
                        params.action !== null
                ),
                filter(() => !this.navigationGuardService.isNavigating)
            )
            .subscribe((params) => {
                if (
                    params &&
                    Object.values(INVOICE_BUTTONS_ACTIONS_ENUM).includes(
                        params.action
                    )
                ) {
                    this.executeNavigation(params);
                }
            });
    }

    public filter(filterData: InvoiceFilterInterface): void {
        this.invoiceApiService.fetchInvoice(filterData);
    }

    public onPageChange(event: number): void {
        this.invoiceApiService
            .getDataFilterInvoice()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.invoiceApiService.fetchInvoice(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public executeNavigation(params: InvoicePageActionsType): void {
        const reference = params.data ? params.data : null;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case INVOICE_BUTTONS_ACTIONS_ENUM.INVOICE:
                routePath = `${reference}`;
                break;
            default:
                console.warn('Action non gérée:', params.action);
                return;
        }

        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public navigateByUrl(params: InvoicePageActionsType): void {
        this.navigationGuardService.setInvoiceNavigationGuard(
            {} as InvoicePageActionsType,
            true
        );
        this.navigationGuardService.setInvoiceNavigationGuard(params, true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
