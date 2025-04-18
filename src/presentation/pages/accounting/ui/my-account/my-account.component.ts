import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { MyAccountApiService } from '../../data-access/my-account/service/my-account-api.service';
import { MappingService } from '../../../../../shared/services/mapping.service';
import {
    myAccountApiResponseInterface,
    myAccountInterface,
} from '../../data-access/my-account/interfaces/my-account.interface';
import { myAccountFilterInterface } from '../../data-access/my-account/interfaces/my-account-filter.interface';
import {
    MY_ACCOUNT_OPERATION_ENUM,
    T_MY_ACCOUNT_OPERATION_ENUM,
} from '../../data-access/my-account/enums/my-account-operation.enum';

type PageAction = {
    data: myAccountInterface;
    action: 'fund-my-account';
    view: 'page';
};

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: [`./my-account.component.scss`],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<myAccountInterface>>;
    public listMyAccountResponse$: Observable<myAccountApiResponseInterface>;
    public listAccount$: Observable<Array<myAccountInterface>>;
    public listOperations: Array<T_MY_ACCOUNT_OPERATION_ENUM> = [];
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private myAccountApiService: MyAccountApiService
    ) {
        Object.values(MY_ACCOUNT_OPERATION_ENUM).forEach((item) => {
            this.listOperations.push(item);
        });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.listAccount$ = this.myAccountApiService.getMyAccount();
        this.listMyAccountResponse$ =
            this.myAccountApiService.getApiResponseMyAccount();
        this.pagination$ = this.myAccountApiService.getMyAccountPagination();
        combineLatest([
            this.myAccountApiService.getDataFilterMyAccount(),
            this.myAccountApiService.getDataNbrPageMyAccount(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.myAccountApiService.fetchMyAccount(filterData, nbrPageData);
        });
        this.myAccountApiService
            .isLoadingMyAccount()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: myAccountFilterInterface): void {
        this.myAccountApiService.fetchMyAccount(filterData);
    }

    public onPageChange(event: number): void {
        this.myAccountApiService
            .getDataFilterMyAccount()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.myAccountApiService.fetchMyAccount(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public navigateByUrl(params: PageAction): void {
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case 'fund-my-account':
                routePath = 'form';
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
