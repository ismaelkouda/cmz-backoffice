import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../data-access/managed-customers/enums/managed-customers-step.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { CustomersFilterInterface } from '../../data-access/customers/interfaces/customers-filter.interface';
import { CustomersInterface } from '../../data-access/customers/interfaces/customers.interface';
import { CustomersApiService } from '../../data-access/customers/services/customers-api.service';
import {
    CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
    T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
} from '../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import {
    T_TYPE_CUSTOMERS_ENUM,
    TYPE_CUSTOMERS_ENUM,
} from '../../../../../shared/enum/type-customers.enum';

type PageAction = {
    data: CustomersInterface;
    action: T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;
    view: 'page';
};

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<CustomersInterface>>;
    public listCustomers$!: Observable<CustomersInterface[]>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listCustomersStep: Array<T_CUSTOMERS_MANAGED_STEP_ENUM> =
        Object.values(CUSTOMERS_MANAGED_STEP_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private customersApiService: CustomersApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[4];
        });
        this.listCustomers$ = this.customersApiService.getCustomers();
        this.pagination$ = this.customersApiService.getCustomersPagination();
        combineLatest([
            this.customersApiService.getDataFilterCustomers(),
            this.customersApiService.getDataNbrPageCustomers(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.customersApiService.fetchCustomers(
                { ...filterData },
                nbrPageData
            );
        });
        this.customersApiService.isLoadingCustomers().subscribe((spinner) => {
            this.spinner = spinner;
        });
    }

    public filter(filterData: CustomersFilterInterface): void {
        this.customersApiService.fetchCustomers(filterData);
    }

    public onPageChange(event: number): void {
        this.customersApiService
            .getDataFilterCustomers()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.customersApiService.fetchCustomers(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public navigateByUrl(params: PageAction): void {
        const code_client = params.data ? params.data['code_client'] : null;
        const ref = params.action;
        const type_enterprise = TYPE_CUSTOMERS_ENUM.COMMERCIAL_ENTERPRISE;
        const queryParams = { ref, type_enterprise };

        const actionHandlers: Record<string, () => string> = {
            [CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM.OPEN]: () =>
                `${code_client}`,
        };

        const handler = actionHandlers[params.action];
        if (!handler) {
            console.warn('Action non gérée:', params.action);
            return;
        }

        const routePath = handler();
        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
