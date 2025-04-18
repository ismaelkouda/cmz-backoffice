import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
    BADGE_ETAPE,
    T_BADGE_ETAPE,
} from './../../../../../shared/constants/badge-etape.constant';
import {
    BADGE_ETAT,
    T_BADGE_ETAT,
} from './../../../../../shared/constants/badge-etat.contant';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { simCardApiService } from '../../data-access/sim-card/services/sim-card-api.service';
import { simCardInterface } from '../../data-access/sim-card/interfaces/sim-card.interface';
import { simCardFilterInterface } from '../../data-access/sim-card/interfaces/sim-card-filter.interface';
import { ApnInterface } from '@shared/interfaces/apn.interface';
import { FormulasInterface } from '@shared/interfaces/formulas.interface';
import { FirstLevelInterface } from '@shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '@shared/interfaces/third-level.interface';
import {
    SIM_CARD_STATUS_ENUM,
    T_SIM_CARD_STATUS_ENUM,
} from '../../data-access/sim-card/enums/sim-card-status.enum';
import { UsageInterface } from '../../../../../shared/interfaces/usage.interface';

const step_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const etat_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction = {
    data: simCardInterface;
    action: 'view-sim-card' | 'update-sim-card' | 'identification-sim-card';
    view: 'page';
};

@Component({
    selector: 'app-sim-card',
    templateUrl: './sim-card.component.html',
})
export class SimCardComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<simCardInterface>>;
    public listStepSimCard: Array<T_BADGE_ETAPE> = step_values;
    public listStateSimCard: Array<T_BADGE_ETAT> = etat_values;
    public listSimCard$: Observable<simCardInterface[]>;
    public simCardSelected$: Observable<simCardInterface>;
    public listUsages$: Observable<Array<UsageInterface>>;
    public listApn$: Observable<Array<ApnInterface>>;
    public listFormulas$: Observable<Array<FormulasInterface>>;
    public listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    public listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    public listStatusSimCard: Array<T_SIM_CARD_STATUS_ENUM> = [];
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private simCardApiService: simCardApiService
    ) {
        Object.values(SIM_CARD_STATUS_ENUM).forEach((item) => {
            this.listStatusSimCard.push(item);
        });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.sharedService.fetchApplicants();
        this.listUsages$ = this.sharedService.getApplicants();
        this.sharedService.fetchFormulas();
        this.listFormulas$ = this.sharedService.getFormulas();
        this.sharedService.fetchApn();
        this.listApn$ = this.sharedService.getApn();
        this.sharedService.fetchFirstLevel();
        this.listFirstLevel$ = this.sharedService.getFirstLevel();
        this.sharedService.fetchThirdLevel();
        this.listThirdLevel$ = this.sharedService.getThirdLevel();
        this.listSimCard$ = this.simCardApiService.getSimCard();
        this.pagination$ = this.simCardApiService.getSimCardPagination();
        this.simCardSelected$ = this.simCardApiService.getSimCardSelected();
        combineLatest([
            this.simCardApiService.getDataFilterSimCard(),
            this.simCardApiService.getDataNbrPageSimCard(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.simCardApiService.fetchSimCard({ ...filterData }, nbrPageData);
        });
        this.simCardApiService.isLoadingSimCard().subscribe((spinner) => {
            this.spinner = spinner;
        });
    }

    public filter(filterData: simCardFilterInterface): void {
        this.simCardApiService.fetchSimCard(filterData);
    }

    public onPageChange(event: number): void {
        this.simCardApiService
            .getDataFilterSimCard()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.simCardApiService.fetchSimCard(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public navigateByUrl(params: PageAction): void {
        const imsi = params.data?.imsi;
        const msisdn = params.data?.msisdn;
        const ref = params.action;
        const queryParams = { msisdn, ref };
        let routePath: string = '';

        switch (params.action) {
            case 'view-sim-card':
            case 'update-sim-card':
            case 'identification-sim-card':
                routePath = `${imsi}`;
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
