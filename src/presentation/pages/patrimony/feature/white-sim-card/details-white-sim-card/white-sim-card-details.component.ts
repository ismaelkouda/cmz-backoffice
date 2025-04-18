import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { whiteSimCardApiService } from '../../../data-access/white-sim-card/services/white-sim-card-api.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
    whiteSimCardDetailsInterface,
    WhiteSimCardInterface,
} from '../../../data-access/white-sim-card/interfaces/white-sim-card-details.interface';
import { PATRIMONY } from '../../../../../../shared/routes/routes';
import { WHITE_SIM_CARD } from '../../../patrimony-routing.module';
import { whiteSimCardDetailsFilterInterface } from '../../../data-access/white-sim-card/interfaces/white-sim-card-details-filter.interface';

type TYPEVIEW = 'view-white-sim-card';
const TYPEVIEW_VALUES: TYPEVIEW[] = ['view-white-sim-card'];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
type PageAction = { data: Object; action: 'détails'; view: 'page' };

@Component({
    selector: 'app-white-sim-card-details',
    templateUrl: './white-sim-card-details.component.html',
})
export class WhiteSimCardDetailsComponent implements OnInit, OnDestroy {
    public spinner: boolean = true;
    public module: string;
    public subModule: string;
    public urlParamRef: TYPEVIEW;
    public urlParamId: number | null;
    public urlParamFilter: Object;
    public urlParamNumberDemand: string;
    public listWhiteSimCardDetails$: Observable<Array<WhiteSimCardInterface>>;
    public displayUrlErrorPage: boolean = false;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private whiteSimCardApiService: whiteSimCardApiService,
        private router: Router
    ) {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.['ref'];
            this.urlParamNumberDemand = params?.['number_demand'];
        });
        // on vérifie si this.urlParamId est défini et s'il peut être converti en un nombre valide avec !isNaN(Number(v)).
        const idParam = this.activatedRoute.snapshot.paramMap.get('id');
        this.urlParamId =
            idParam !== null && !isNaN(Number(idParam))
                ? Number(idParam)
                : null;
        this.getParamsInUrl();
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
    }

    private getParamsInUrl(): void {
        if (!isTypeView(this.urlParamRef) || !this.urlParamId) {
            this.displayUrlErrorPage = true;
        } else {
            if (this.urlParamId) {
                this.listWhiteSimCardDetails$ =
                    this.whiteSimCardApiService.getWhiteSimCardDetails();
                this.whiteSimCardApiService.fetchWhiteSimCardDetails({
                    id: this.urlParamId,
                });
                this.whiteSimCardApiService
                    .isLoadingWhiteSimCardDetails()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((spinner: boolean) => {
                        this.spinner = spinner;
                    });
            }
        }
    }

    public filter(filterData: whiteSimCardDetailsFilterInterface): void {
        this.whiteSimCardApiService.fetchWhiteSimCardDetails({
            ...filterData,
            id: this.urlParamId,
        });
    }

    public onGoToBack(): void {
        this.router.navigate([PATRIMONY + '/' + WHITE_SIM_CARD]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
