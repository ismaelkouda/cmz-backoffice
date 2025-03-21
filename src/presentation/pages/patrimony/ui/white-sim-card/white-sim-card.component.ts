import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { whiteSimCardApiService } from '../../data-access/white-sim-card/services/white-sim-card-api.service';
import { whiteSimCardGlobalStateInterface, whiteSimCardInterface } from '../../data-access/white-sim-card/interfaces/white-sim-card.interface';
import { whiteSimCardFilterInterface } from '../../data-access/white-sim-card/interfaces/white-sim-card-filter.interface';
import { WHITE_SIM_CARD_STATUS_ENUM } from '../../data-access/white-sim-card/enums/white-sim-card-status.enum';
import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';

type PageAction = { data: whiteSimCardInterface, action: 'view-white-sim-card' | 'update-white-sim-card' | 'identification-white-sim-card', view: 'page' };

@Component({
    selector: 'app-white-sim-card',
    templateUrl: './white-sim-card.component.html'
})

export class WhiteSimCardComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<whiteSimCardInterface>>;
    public filterData: whiteSimCardFilterInterface;
    public listStatusWhiteSimCard = [WHITE_SIM_CARD_STATUS_ENUM];
    public listWhiteSimCard$: Observable<whiteSimCardInterface[]>;
    public whiteSimCardSelected$: Observable<whiteSimCardInterface>;
    public whiteSimCardGlobalState$: Observable<whiteSimCardGlobalStateInterface>;
    public statistiquesBox: Array<IStatistiquesBox> = [];
    private destroy$ = new Subject<void>();

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute, private whiteSimCardApiService: whiteSimCardApiService) {
    }

    ngOnInit(): void {
        
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.listWhiteSimCard$ = this.whiteSimCardApiService.getWhiteSimCard();
        this.pagination$ = this.whiteSimCardApiService.getWhiteSimCardPagination();
        this.whiteSimCardSelected$ = this.whiteSimCardApiService.getWhiteSimCardSelected();
        this.whiteSimCardApiService.getWhiteSimCardGlobalState().pipe(takeUntil(this.destroy$)).subscribe((globalState) => {
            this.getTchesBoxValues(globalState);
        });
        combineLatest([
            this.whiteSimCardApiService.getDataFilterWhiteSimCard(),
            this.whiteSimCardApiService.getDataNbrPageWhiteSimCard()
        ]).subscribe(([filterData, nbrPageData]) => {
            this.whiteSimCardApiService.fetchWhiteSimCard(filterData, nbrPageData);
        });
    }

    public filter(filterData: whiteSimCardFilterInterface): void {
        this.filterData = filterData;
        this.whiteSimCardApiService.fetchWhiteSimCard(filterData)
    }

    public onPageChange(event: number): void {
        this.whiteSimCardApiService.fetchWhiteSimCard(this.filterData, JSON.stringify(event + 1))
    }

    public navigateByUrl(params: PageAction): void {
        const id = params.data?.id;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case "view-white-sim-card": routePath = `${id}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
        }
    }

    getTchesBoxValues(rapport: whiteSimCardGlobalStateInterface): void {
        this.statistiquesBox = [
            {
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Lots disponibles',
                count: rapport?.["total_lots"] || 0,
                taux: ''
            },
            {
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Cartes SIM des lots',
                count: rapport?.["total"] || 0,
                taux: rapport?.["pourcentage_total"]
            },
            {
                cardBgColor: 'rgb(254, 154, 46)',
                legend: '# Disponibles',
                count: rapport?.["total_disponibles"] || 0,
                taux: rapport?.["pourcentage_disponibles"] || 0
            },
            {
                cardBgColor: 'rgb(255, 255, 255)',
                cardBorderColor: '#000',
                legendColor: '#000',
                countColor: '#000',
                legend: '# Réservées',
                count: rapport?.["total_reserves"] || 0,
                taux: rapport?.["pourcentage_reserves"] || 0
            },
            {
                cardBgColor: 'rgb(39, 174, 96)',
                legend: '# Attribuées',
                count: rapport?.["total_attribues"] || 0,
                taux: rapport?.["pourcentage_attribues"] || 0
            }
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
