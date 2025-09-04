import { FORM, INVOICE, PAYMENT } from '../../requests-service-routing.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { CustomersActivateFilterInterface } from '../../data-access/customers-activate/interfaces/customers-activate-filter.interface';
import { REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM } from '../../data-access/requests-service/enums/requests-service-buttons-actions.enum';
import {
    CUSTOMERS_ACTIVATE_STEP_ENUM,
    T_CUSTOMERS_ACTIVATE_STEP_ENUM,
} from '../../data-access/customers-activate/enums/customers-activate-step.enum';
import {
    CUSTOMERS_ACTIVATE_STATE_ENUM,
    T_CUSTOMERS_ACTIVATE_STATE_ENUM,
} from '../../data-access/customers-activate/enums/customers-activate-state.enum';
import {
    T_TYPE_CUSTOMERS_ENUM,
    TYPE_CUSTOMERS_ENUM,
} from '../../../../../shared/enum/type-customers.enum';
import { SharedService } from '../../../../../shared/services/shared.service';
import { CustomersActivateInterface } from '../../../../../shared/interfaces/customers-activate.interface';
import { CustomersActivatePageActionsType } from '../../data-access/customers-activate/types/customers-activate-page-actions.type';
import { CustomersActivateNavigationGuardService } from '../../data-access/customers-activate/services/customers-activate-navigation-guard.service';

@Component({
    selector: 'app-customers-activate',
    templateUrl: './customers-activate.component.html',
})
export class CustomersActivateComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<CustomersActivateInterface>>;
    public listCustomersActivate$: Observable<CustomersActivateInterface[]>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listCustomersActivateStep: Array<T_CUSTOMERS_ACTIVATE_STEP_ENUM> =
        Object.values(CUSTOMERS_ACTIVATE_STEP_ENUM);
    public listCustomersActivateState: Array<T_CUSTOMERS_ACTIVATE_STATE_ENUM> =
        Object.values(CUSTOMERS_ACTIVATE_STATE_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private sharedService: SharedService,
        private navigationGuardService: CustomersActivateNavigationGuardService
    ) {
        this.setupNavigationListener();
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.listCustomersActivate$ = this.sharedService.getCustomersActivate();
        this.pagination$ = this.sharedService.getCustomersActivatePagination();

        combineLatest([
            this.sharedService.getDataFilterCustomersActivate(),
            this.sharedService.getDataNbrPageCustomersActivate(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.sharedService.fetchCustomersActivate(filterData, nbrPageData);
        });
        this.sharedService.isLoadingCustomersActivate().subscribe((spinner) => {
            this.spinner = spinner;
        });
    }
    private setupNavigationListener(): void {
        this.navigationGuardService
            .getCustomersActivateNavigationGuard()
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
                    Object.values(
                        REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM
                    ).includes(params.action)
                ) {
                    this.executeNavigation(params);
                }
            });
    }
    public filter(filterData: CustomersActivateFilterInterface): void {
        this.sharedService.fetchCustomersActivate(filterData);
    }

    public onPageChange(event: number): void {
        this.sharedService
            .getDataFilterCustomersActivate()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.sharedService.fetchCustomersActivate(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public executeNavigation(params: CustomersActivatePageActionsType): void {
        const number_demand = params.data ? params.data : null;
        const ref = params.action;
        const type_enterprise: T_TYPE_CUSTOMERS_ENUM =
            TYPE_CUSTOMERS_ENUM.COMMERCIAL_ENTERPRISES;
        const queryParams = { ref, type_enterprise };
        let routePath: string = '';

        switch (params.action) {
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.OPEN:
                routePath = `${number_demand}`;
                break;
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.EDIT:
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.ADD:
                routePath = FORM;
                break;
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.PAYMENT:
                routePath = `${PAYMENT}/${number_demand}`;
                break;
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.INVOICE:
                routePath = `${INVOICE}/${number_demand}`;
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

    public navigateByUrl(params: CustomersActivatePageActionsType): void {
        this.navigationGuardService.setCustomersActivateNavigationGuard(
            {} as CustomersActivatePageActionsType,
            true
        );
        this.navigationGuardService.setCustomersActivateNavigationGuard(
            params,
            true
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
