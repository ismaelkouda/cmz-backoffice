import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import {
    MY_ACCOUNT_OPERATION_ENUM,
    T_MY_ACCOUNT_OPERATION_ENUM,
} from '../../data-access/my-account/enums/my-account-operation.enum';
import { myAccountFilterInterface } from '../../data-access/my-account/interfaces/my-account-filter.interface';
import {
    myAccountApiResponseInterface,
    myAccountInterface,
} from '../../data-access/my-account/interfaces/my-account.interface';
import { MyAccountApiService } from '../../data-access/my-account/service/my-account-api.service';
import { FilterMyAccountComponent } from '../../feature/my-account/filter-my-account/filter-my-account.component';
import { TableMyAccountComponent } from '../../feature/my-account/table-my-account/table-my-account.component';

type PageAction = {
    data: myAccountInterface;
    action: 'fund-my-account';
    view: 'page';
};

@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrls: [`./my-account.component.scss`],
    imports: [
        CommonModule,
        PatrimoineHeaderComponent,
        BreadcrumbComponent,
        FilterMyAccountComponent,
        TableMyAccountComponent,
        ParginationComponent,
        AsyncPipe,
        TranslateModule
    ],
})
export class MyAccountComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<myAccountInterface>>;
    public listMyAccountResponse$!: Observable<myAccountApiResponseInterface>;
    public listAccount$!: Observable<Array<myAccountInterface>>;
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
            this.module = data['module'];
            this.subModule = data['subModule'][3];
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

        if (params.action === 'fund-my-account') {
            routePath = 'form';
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
