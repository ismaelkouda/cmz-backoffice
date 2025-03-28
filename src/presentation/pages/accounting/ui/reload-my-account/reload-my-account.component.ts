import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { ReloadMyAccountApiService } from '../../data-access/reload-my-account/service/reload-my-account-api.service';
import { reloadMyAccountInterface } from '../../data-access/reload-my-account/interfaces/reload-my-account.interface';
import { reloadMyAccountFilterInterface } from '../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface';

type PageAction = { 'data': reloadMyAccountInterface, 'action': 'reload-my-account', 'view': 'page' };

@Component({
    selector: "app-reload-my-account",
    templateUrl: "./reload-my-account.component.html",
    styleUrls: [`./reload-my-account.component.scss`]
})

export class ReloadMyAccountComponent implements OnInit, OnDestroy {

    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<reloadMyAccountInterface>>;
    public listReloadAccount$: Observable<Array<reloadMyAccountInterface>>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private reloadMyAccountApiService: ReloadMyAccountApiService) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });
        this.listReloadAccount$ = this.reloadMyAccountApiService.getReloadMyAccount();
        this.pagination$ = this.reloadMyAccountApiService.getReloadMyAccountPagination();
        combineLatest([
            this.reloadMyAccountApiService.getDataFilterReloadMyAccount(),
            this.reloadMyAccountApiService.getDataNbrPageReloadMyAccount()
        ]).subscribe(([filterData, nbrPageData]) => {
            this.reloadMyAccountApiService.fetchReloadMyAccount(filterData, nbrPageData);
        });
        this.reloadMyAccountApiService.isLoadingReloadMyAccount().pipe(takeUntil(this.destroy$)).subscribe((spinner: boolean) => {
            this.spinner = spinner;
        });
    }

    public filter(filterData: reloadMyAccountFilterInterface): void {
        this.reloadMyAccountApiService.fetchReloadMyAccount(filterData)
    }

    public onPageChange(event: number): void {
        this.reloadMyAccountApiService.getDataFilterReloadMyAccount().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.reloadMyAccountApiService.fetchReloadMyAccount(filterData, JSON.stringify(event + 1))
        });
    }

    public navigateByUrl(params: PageAction): void {
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case "reload-my-account": routePath = "form"; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}