import { MY_RELOADS_STATUS_ENUM, T_MY_RELOADS_STATUS_ENUM } from './../../data-access/reload-my-account/enums/reload-my-account-status.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { ReloadMyAccountApiService } from '../../data-access/reload-my-account/service/reload-my-account-api.service';
import { reloadMyAccountApiResponseInterface, reloadMyAccountGlobalStateInterface, reloadMyAccountInterface } from '../../data-access/reload-my-account/interfaces/reload-my-account.interface';
import { reloadMyAccountFilterInterface } from '../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface';
import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';

type PageAction = { 'data': reloadMyAccountInterface, 'action': 'reload-my-account'|'edit-reload-my-account'|'details-reload-my-account', 'view': 'page' };
const etape_values = [MY_RELOADS_STATUS_ENUM.IN_PROGRESS, MY_RELOADS_STATUS_ENUM.VALIDATED, MY_RELOADS_STATUS_ENUM.REJECTED];
const indexBoxClickable = [1, 2, 3] as const;

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
    public listReloadAccountResponse$: Observable<reloadMyAccountApiResponseInterface>;
    public reloadAccountGlobalState$: Observable<reloadMyAccountGlobalStateInterface>;
    public listStatus: Array<T_MY_RELOADS_STATUS_ENUM> = etape_values;
    public statisticsBox: Array<IStatistiquesBox> = [];
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private reloadMyAccountApiService: ReloadMyAccountApiService) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.listReloadAccount$ = this.reloadMyAccountApiService.getReloadMyAccount();
        this.listReloadAccountResponse$ = this.reloadMyAccountApiService.getApiResponseReloadMyAccount();
        this.pagination$ = this.reloadMyAccountApiService.getReloadMyAccountPagination();
        this.reloadMyAccountApiService.getReloadMyAccountGlobalState().pipe(takeUntil(this.destroy$)).subscribe((globalState) => {
            this.getStatisticsBoxValues(globalState);
        });
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
        const transaction = params.data?.transaction;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case "details-reload-my-account":
            case "edit-reload-my-account": routePath = `${transaction}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "reload-my-account": routePath = "form"; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
        }
    }

    getStatisticsBoxValues(rapport: reloadMyAccountGlobalStateInterface): void {
        this.statisticsBox = [
            {
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# En attente',
                count: rapport?.["totalEnAttentes"] || 0,
                taux: rapport?.["pourcentageEnAttentes"] ?? 0
            },
            {
                id: 1,
                cardBgColor: 'rgb(254, 154, 46)',
                legend: '# En cours',
                count: rapport?.["totalEncours"] || 0,
                taux: rapport?.["pourcentageEnCours"] || 0
            },
            {
                id: 2,
                cardBgColor: 'rgb(39, 174, 96)',
                legend: '# Validés',
                count: rapport?.["totalValides"] || 0,
                taux: rapport?.["pourcentageValide"] || 0
            },
            {
                id: 3,
                cardBgColor: '#e74c3c',
                legend: '# Rejetés',
                count: rapport?.["totalRejetes"] || 0,
                taux: rapport?.["pourcentageRejetes"] || 0
            }
        ];
    }

    public onBoxClick(statisticBox: IStatistiquesBox) {
        type IndexBoxClickable = (typeof indexBoxClickable)[number];
        if (indexBoxClickable.includes(statisticBox.id as IndexBoxClickable)) {
            this.reloadMyAccountApiService.getDataFilterReloadMyAccount()
                .pipe(takeUntil(this.destroy$))
                .subscribe((filterData: any) => {
                    switch (statisticBox.id) {
                        case 1: filterData.statut = MY_RELOADS_STATUS_ENUM.IN_PROGRESS; break;
                        case 2: filterData.statut = MY_RELOADS_STATUS_ENUM.VALIDATED; break;
                        case 3: filterData.statut = MY_RELOADS_STATUS_ENUM.REJECTED; break;
                        default: return;
                    }
                    this.reloadMyAccountApiService.fetchReloadMyAccount(filterData);
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}