import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from 'shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import {
    BADGE_OPERATION_CLAIMS,
    T_BADGE_OPERATION_CLAIMS,
} from '../../data-access/claims/constants/claims-operation.constant copy';
import {
    BADGE_STATE_CLAIMS,
    T_BADGE_STATE_CLAIMS,
} from '../../data-access/claims/constants/claims-state.constant';
import {
    BADGE_STEP_CLAIMS,
    T_BADGE_STEP_CLAIMS,
} from '../../data-access/claims/constants/claims-step.constant';
import { claimsFilterInterface } from '../../data-access/claims/interfaces/claims-filter.interface';
import { claimsInterface } from '../../data-access/claims/interfaces/claims.interface';
import { ClaimsApiService } from '../../data-access/claims/services/claims-api.service';
import { FilterClaimsComponent } from '../../feature/claims/filter-claims/filter-claims.component';
import { TableClaimsComponent } from '../../feature/claims/table-claims/table-claims.component';
import {
    FORM,
    INVOICE_FORM_ROUTE,
    SIM_DEMAND_ROUTE,
} from '../../overseeing-operations-routing.module';
import { SharedService } from './../../../../../shared/services/shared.service';

type PageAction = {
    data: claimsInterface | null;
    action: 'open-folder-claims' | 'invoice-claims' | 'add-claims';
    view: 'page';
};

@Component({
    selector: 'app-claims',
    standalone: true,
    templateUrl: './claims.component.html',
    imports: [
        PatrimoineHeaderComponent,
        FilterClaimsComponent,
        TableClaimsComponent,
        ParginationComponent,
        BreadcrumbComponent,
        TranslateModule,
        AsyncPipe,
    ],
})
export class ClaimsComponent implements OnInit {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<claimsInterface>>;
    public filterData!: claimsFilterInterface;
    public listClaims$!: Observable<Array<claimsInterface>>;
    public listApplicants$!: Observable<any[]>;
    public listOperations: Array<T_BADGE_OPERATION_CLAIMS> = [];
    public listStepClaims: Array<T_BADGE_STEP_CLAIMS>;
    public listStateClaims: Array<T_BADGE_STATE_CLAIMS>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private claimsApiService: ClaimsApiService
    ) {
        this.listOperations = Object.values(BADGE_OPERATION_CLAIMS);
        this.listStepClaims = Object.values(BADGE_STEP_CLAIMS);
        this.listStateClaims = Object.values(BADGE_STATE_CLAIMS);
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][2];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
        this.listClaims$ = this.claimsApiService.getClaims();
        this.pagination$ = this.claimsApiService.getClaimsPagination();

        combineLatest([
            this.claimsApiService.getDataFilterClaims(),
            this.claimsApiService.getDataNbrPageClaims(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.claimsApiService.fetchClaims(filterData, nbrPageData);
        });
        this.claimsApiService
            .isLoadingClaims()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: claimsFilterInterface): void {
        this.claimsApiService.fetchClaims(filterData);
    }

    public onPageChange(event: number): void {
        this.claimsApiService
            .getDataFilterClaims()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.claimsApiService.fetchClaims(
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
            case 'open-folder-claims':
                routePath = `${SIM_DEMAND_ROUTE}/${number_demand}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
            case 'invoice-claims':
                routePath = `${INVOICE_FORM_ROUTE}/${number_demand}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
            case 'add-claims':
                routePath = FORM;
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
