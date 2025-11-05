import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../shared/enum/type-customers.enum';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { AssociationEnterprisesFilterInterface } from '../../data-access/association-enterprises/interfaces/association-enterprises-filter.interface';
import { AssociationEnterprisesInterface } from '../../data-access/association-enterprises/interfaces/association-enterprises.interface';
import { AssociationEnterprisesApiService } from '../../data-access/association-enterprises/services/association-enterprises-api.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../data-access/managed-customers/enums/managed-customers-step.enum';
import {
    CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
    T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
} from '../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import { FilterAssociationEnterprisesComponent } from '../../feature/association-enterprises/filter-association-enterprises/filter-association-enterprises.component';
import { TableAssociationEnterprisesComponent } from '../../feature/association-enterprises/table-association-enterprises/table-association-enterprises.component';

type PageAction = {
    data: AssociationEnterprisesInterface;
    action: T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;
    view: 'page';
};

@Component({
    selector: 'app-association-enterprises',
    standalone: true,
    templateUrl: './association-enterprises.component.html',
    imports: [
        CommonModule,
        PatrimoineHeaderComponent,
        BreadcrumbComponent,
        FilterAssociationEnterprisesComponent,
        TableAssociationEnterprisesComponent,
        ParginationComponent,
        AsyncPipe,
        TranslateModule
    ],
})
export class AssociationEnterprisesComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<AssociationEnterprisesInterface>>;
    public listAssociationEnterprises$!: Observable<
        AssociationEnterprisesInterface[]
    >;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listAssociationEnterprisesStep: Array<T_CUSTOMERS_MANAGED_STEP_ENUM> =
        Object.values(CUSTOMERS_MANAGED_STEP_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private associationEnterprisesApiService: AssociationEnterprisesApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][2];
        });
        this.listAssociationEnterprises$ =
            this.associationEnterprisesApiService.getAssociationEnterprises();
        this.pagination$ =
            this.associationEnterprisesApiService.getAssociationEnterprisesPagination();
        combineLatest([
            this.associationEnterprisesApiService.getDataFilterAssociationEnterprises(),
            this.associationEnterprisesApiService.getDataNbrPageAssociationEnterprises(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.associationEnterprisesApiService.fetchAssociationEnterprises(
                { ...filterData },
                nbrPageData
            );
        });
        this.associationEnterprisesApiService
            .isLoadingAssociationEnterprises()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: AssociationEnterprisesFilterInterface): void {
        this.associationEnterprisesApiService.fetchAssociationEnterprises(
            filterData
        );
    }

    public onPageChange(event: number): void {
        this.associationEnterprisesApiService
            .getDataFilterAssociationEnterprises()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.associationEnterprisesApiService.fetchAssociationEnterprises(
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
        let routePath: string = '';

        if (params.action === CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM.OPEN) {
            routePath = `${code_client}`;
            this.router.navigate([routePath], {
                relativeTo: this.activatedRoute,
                queryParams,
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
