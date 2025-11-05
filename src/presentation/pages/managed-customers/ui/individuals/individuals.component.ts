import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from 'shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import { TYPE_CUSTOMERS_ENUM } from '../../../../../shared/enum/type-customers.enum';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { IndividualsFilterInterface } from '../../data-access/individuals/interfaces/individuals-filter.interface';
import { IndividualsInterface } from '../../data-access/individuals/interfaces/individuals.interface';
import { IndividualsApiService } from '../../data-access/individuals/services/individuals-api.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../data-access/managed-customers/enums/managed-customers-step.enum';
import {
    CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
    T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
} from '../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import { FilterIndividualsComponent } from '../../feature/individuals/filter-individuals/filter-individuals.component';
import { TableIndividualsComponent } from '../../feature/individuals/table-individuals/table-individuals.component';

type PageAction = {
    data: IndividualsInterface;
    action: T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;
    view: 'page';
};

@Component({
    selector: 'app-individuals',
    standalone: true,
    templateUrl: './individuals.component.html',
    imports: [
        CommonModule,
        PatrimoineHeaderComponent,
        FilterIndividualsComponent,
        TableIndividualsComponent,
        ParginationComponent,
        BreadcrumbComponent,
        AsyncPipe,
        TranslateModule
    ],
})
export class IndividualsComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<IndividualsInterface>>;
    public listIndividuals$!: Observable<IndividualsInterface[]>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listIndividualsStep: Array<T_CUSTOMERS_MANAGED_STEP_ENUM> =
        Object.values(CUSTOMERS_MANAGED_STEP_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private individualsApiService: IndividualsApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][3];
        });
        this.listIndividuals$ = this.individualsApiService.getIndividuals();
        this.pagination$ =
            this.individualsApiService.getIndividualsPagination();
        combineLatest([
            this.individualsApiService.getDataFilterIndividuals(),
            this.individualsApiService.getDataNbrPageIndividuals(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.individualsApiService.fetchIndividuals(
                { ...filterData },
                nbrPageData
            );
        });
        this.individualsApiService
            .isLoadingIndividuals()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: IndividualsFilterInterface): void {
        this.individualsApiService.fetchIndividuals(filterData);
    }

    public onPageChange(event: number): void {
        this.individualsApiService
            .getDataFilterIndividuals()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.individualsApiService.fetchIndividuals(
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
