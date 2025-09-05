import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from './../../data-access/managed-customers/enums/managed-customers-step.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { CommercialEnterprisesFilterInterface } from '../../data-access/commercial-enterprises/interfaces/commercial-enterprises-filter.interface';
import { CommercialEnterprisesInterface } from '../../data-access/commercial-enterprises/interfaces/commercial-enterprises.interface';
import { CommercialEnterprisesApiService } from '../../data-access/commercial-enterprises/services/commercial-enterprises-api.service';
import {
    CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
    T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
} from '../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type PageAction = {
    data: CommercialEnterprisesInterface;
    action: T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;
    view: 'page';
};

@Component({
    selector: 'app-commercial-enterprises',
    templateUrl: './commercial-enterprises.component.html',
})
export class CommercialEnterprisesComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<CommercialEnterprisesInterface>>;
    public listCommercialEnterprises$: Observable<
        CommercialEnterprisesInterface[]
    >;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listCommercialEnterprisesStep: Array<T_CUSTOMERS_MANAGED_STEP_ENUM> =
        Object.values(CUSTOMERS_MANAGED_STEP_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private commercialEnterprisesApiService: CommercialEnterprisesApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.listCommercialEnterprises$ =
            this.commercialEnterprisesApiService.getCommercialEnterprises();
        this.pagination$ =
            this.commercialEnterprisesApiService.getCommercialEnterprisesPagination();
        combineLatest([
            this.commercialEnterprisesApiService.getDataFilterCommercialEnterprises(),
            this.commercialEnterprisesApiService.getDataNbrPageCommercialEnterprises(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.commercialEnterprisesApiService.fetchCommercialEnterprises(
                { ...filterData },
                nbrPageData
            );
        });
        this.commercialEnterprisesApiService
            .isLoadingCommercialEnterprises()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: CommercialEnterprisesFilterInterface): void {
        this.commercialEnterprisesApiService.fetchCommercialEnterprises(
            filterData
        );
    }

    public onPageChange(event: number): void {
        this.commercialEnterprisesApiService
            .getDataFilterCommercialEnterprises()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.commercialEnterprisesApiService.fetchCommercialEnterprises(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public navigateByUrl(params: PageAction): void {
        const code_client = params.data ? params.data['code_client'] : null;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM.OPEN:
                routePath = `${code_client}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
