import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { CommercialEnterprisesFilterInterface } from '../../data-access/commercial-enterprises/interfaces/commercial-enterprises-filter.interface';
import { CommercialEnterprisesInterface } from '../../data-access/commercial-enterprises/interfaces/commercial-enterprises.interface';
import { CommercialEnterprisesApiService } from '../../data-access/commercial-enterprises/services/commercial-enterprises-api.service';
import { CommercialEnterprisesNavigationGuardService } from '../../data-access/commercial-enterprises/services/commercial-enterprises-navigation-guard.service';
import { CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import { ManagedCustomersPageActionsType } from '../../data-access/managed-customers/types/managed-customers-page-actions.type';
import { FilterCommercialEnterprisesComponent } from '../../feature/commercial-enterprises/filter-commercial-enterprises/filter-commercial-enterprises.component';
import { TableCommercialEnterprisesComponent } from '../../feature/commercial-enterprises/table-commercial-enterprises/table-commercial-enterprises.component';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from './../../data-access/managed-customers/enums/managed-customers-step.enum';

@Component({
    selector: 'app-commercial-enterprises',
    standalone: true,
    templateUrl: './commercial-enterprises.component.html',
    imports: [
        CommonModule,
        PatrimoineHeaderComponent,
        BreadcrumbComponent,
        FilterCommercialEnterprisesComponent,
        TableCommercialEnterprisesComponent,
        ParginationComponent,
        TranslateModule,
    ],
})
export class CommercialEnterprisesComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<CommercialEnterprisesInterface>>;
    public listCommercialEnterprises$!: Observable<
        CommercialEnterprisesInterface[]
    >;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listCommercialEnterprisesStep: Array<T_CUSTOMERS_MANAGED_STEP_ENUM> =
        Object.values(CUSTOMERS_MANAGED_STEP_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private commercialEnterprisesApiService: CommercialEnterprisesApiService,
        private navigationGuardService: CommercialEnterprisesNavigationGuardService
    ) {
        this.setupNavigationListener();
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][0];
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
    private setupNavigationListener(): void {
        this.navigationGuardService
            .getCommercialEnterprisesNavigationGuard()
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
                        CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM
                    ).includes(params.action)
                ) {
                    this.executeNavigation(params);
                }
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

    public executeNavigation(params: ManagedCustomersPageActionsType): void {
        const code_client = params.data ?? null;
        const ref = params.action;
        const queryParams = { ref };

        const actionHandlers: Record<string, () => void> = {
            [CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM.OPEN]: () => {
                const routePath = `${code_client}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
            },
        };

        const handler = actionHandlers[params.action];
        if (handler) {
            handler();
        } else {
            console.warn('Action non gérée :', params.action);
        }
    }

    public navigateByUrl(params: ManagedCustomersPageActionsType): void {
        this.navigationGuardService.setCommercialEnterprisesNavigationGuard(
            {} as ManagedCustomersPageActionsType,
            true
        );
        this.navigationGuardService.setCommercialEnterprisesNavigationGuard(
            params,
            true
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
