import {
    MANAGED_CUSTOMERS_STEP_ENUM,
    T_MANAGED_CUSTOMERS_STEP_ENUM,
} from '../../data-access/managed-customers/enums/managed-customers-step.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { PublicEnterprisesFilterInterface } from '../../data-access/public-enterprises/interfaces/public-enterprises-filter.interface';
import { PublicEnterprisesInterface } from '../../data-access/public-enterprises/interfaces/public-enterprises.interface';
import { PublicEnterprisesApiService } from '../../data-access/public-enterprises/services/public-enterprises-api.service';
import {
    MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM,
    T_MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM,
} from '../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type PageAction = {
    data: PublicEnterprisesInterface;
    action: T_MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM;
    view: 'page';
};

@Component({
    selector: 'app-public-enterprises',
    templateUrl: './public-enterprises.component.html',
})
export class PublicEnterprisesComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<PublicEnterprisesInterface>>;
    public listPublicEnterprises$: Observable<PublicEnterprisesInterface[]>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listPublicEnterprisesStep: Array<T_MANAGED_CUSTOMERS_STEP_ENUM> =
        Object.values(MANAGED_CUSTOMERS_STEP_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private publicEnterprisesApiService: PublicEnterprisesApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.listPublicEnterprises$ =
            this.publicEnterprisesApiService.getPublicEnterprises();
        this.pagination$ =
            this.publicEnterprisesApiService.getPublicEnterprisesPagination();
        combineLatest([
            this.publicEnterprisesApiService.getDataFilterPublicEnterprises(),
            this.publicEnterprisesApiService.getDataNbrPagePublicEnterprises(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.publicEnterprisesApiService.fetchPublicEnterprises(
                { ...filterData },
                nbrPageData
            );
        });
        this.publicEnterprisesApiService
            .isLoadingPublicEnterprises()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: PublicEnterprisesFilterInterface): void {
        this.publicEnterprisesApiService.fetchPublicEnterprises(filterData);
    }

    public onPageChange(event: number): void {
        this.publicEnterprisesApiService
            .getDataFilterPublicEnterprises()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.publicEnterprisesApiService.fetchPublicEnterprises(
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
            case MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM.OPEN:
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
