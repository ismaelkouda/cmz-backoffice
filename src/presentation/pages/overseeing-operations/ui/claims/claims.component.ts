import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OperationTransaction } from './../../../../../shared/enum/OperationTransaction.enum';
import { combineLatest, Observable } from 'rxjs';
import { claimsFilterInterface } from '../../data-access/claims/interfaces/claims-filter.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Folder } from '../../../../../shared/interfaces/folder';
import { ClaimsApiService } from '../../data-access/claims/services/claims-api.service';
import { FORM, INVOICE } from '../../overseeing-operations-routing.module';

type PageAction = { data: Folder, action: 'open-folder-claims' | 'invoice-claims' | 'mass-edit-claims' | 'simple-add-claims' | 'mass-add-claims', view: 'page' };

@Component({
    selector: 'app-claims',
    templateUrl: './claims.component.html'
})

export class ClaimsComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<Folder>>;
    public filterData: claimsFilterInterface;
    public listClaims$: Observable<Array<Folder>>;
    public claimsSelected$: Observable<Folder>;
    public listApplicants$: Observable<any[]>;
    public listOperations: Array<string> = [];

    constructor(private router: Router, private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private claimsApiService: ClaimsApiService) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
        this.listClaims$ = this.claimsApiService.getClaims();
        this.pagination$ = this.claimsApiService.getClaimsPagination();
        this.claimsSelected$ = this.claimsApiService.getClaimsSelected();

        combineLatest([
            this.claimsApiService.getDataFilterClaims(),
            this.claimsApiService.getDataNbrPageClaims()
        ]).subscribe(([filterData, nbrPageData]) => {
            this.claimsApiService.fetchClaims(filterData, nbrPageData);
        });
    }

    public filter(filterData: claimsFilterInterface): void {
        this.filterData = filterData;
        this.claimsApiService.fetchClaims(filterData)
    }

    public onPageChange(event: number): void {
        this.claimsApiService.fetchClaims(this.filterData, JSON.stringify(event + 1))
    }

    public navigateByUrl(params: PageAction): void {
        const number_demand = params.data ? params.data["numero_demande"] : null;
        const ref = params.action;
        const operation = params.data.operation;
        const queryParams = { ref, operation };
        let routePath: string = '';

        switch (params.action) {
            case "invoice-claims": routePath = `${INVOICE}/${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "open-folder-claims": routePath = `${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "mass-edit-claims":
            case "simple-add-claims": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION } }); break;
            case "mass-add-claims": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION_EN_MASSE } }); break;
        }
    }
}
