import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { claimsFilterInterface } from '../../data-access/claims/interfaces/claims-filter.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Folder } from '../../../../../shared/interfaces/folder';
import { ClaimsApiService } from '../../data-access/claims/services/claims-api.service';
import { claimsInterface } from '../../data-access/claims/interfaces/claims.interface';

type PageAction = {
    data: Folder;
    action:
        | 'open-folder-claims'
        | 'invoice-claims'
        | 'mass-edit-claims'
        | 'simple-add-claims'
        | 'mass-add-claims';
    view: 'page';
};

@Component({
    selector: 'app-claims',
    templateUrl: './claims.component.html',
})
export class ClaimsComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<claimsInterface>>;
    public filterData: claimsFilterInterface;
    public listClaims$: Observable<Array<claimsInterface>>;
    public listApplicants$: Observable<any[]>;
    public listOperations: Array<string> = [];
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private claimsApiService: ClaimsApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
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
        const operation = params.data.operation;
        const queryParams = { ref, operation };
        let routePath: string = '';

        switch (params.action) {
            case 'open-folder-claims':
                routePath = `${number_demand}`;
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
