import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OperationTransaction } from './../../../../../shared/enum/OperationTransaction.enum';
import { BADGE_ETAPE, T_BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT, T_BADGE_ETAT } from './../../../../../shared/constants/badge-etat.contant';
import { CommandWhiteSim } from '../../data-access/white-sim/interfaces/white-sim.interface';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { INVOICE } from '../../../requests-products/requests-products-routing.module';
import { FORM } from '../../../requests-products/requests-products-routing.module';
import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Folder } from '../../../../../shared/interfaces/folder';

const step_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT, BADGE_ETAPE.CLOTURE];
const state_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE, BADGE_ETAT.EN_ATTENTE, BADGE_ETAT.ABANDONNE, BADGE_ETAT.ACCEPTE];
type PageAction = { data: CommandWhiteSim, action: 'open-folder-white-sim' | 'invoice-white-sim' | 'mass-edit-white-sim' | 'simple-add-white-sim' | 'mass-add-white-sim', view: 'page' };

@Component({
    selector: 'app-white-sim',
    templateUrl: './white-sim.component.html'
})

export class WhiteSimComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<Folder>>;
    public currentPage: string;
    public listStepCommandWhiteSim: Array<T_BADGE_ETAPE> = step_values;
    public listStateCommandWhiteSim: Array<T_BADGE_ETAT> = state_values;
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public listCommandWhiteSim$: Observable<Array<Folder>>;
    public commandWhiteSimSelected$: Observable<Folder>;
    public listApplicants$: Observable<any[]>;
    private destroy$ = new Subject<void>();
    public spinner: boolean = true;

    constructor(private router: Router, private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
        this.listCommandWhiteSim$ = this.sharedService.getDemands();
        this.pagination$ = this.sharedService.getDemandsPagination();
        this.commandWhiteSimSelected$ = this.sharedService.getDemandSelected();
        combineLatest([
            this.sharedService.getDataFilterDemands(),
            this.sharedService.getDataNbrPageDemands()
        ]).subscribe(([filterData, nbrPageData]) => {
            this.sharedService.fetchDemands({ ...filterData, operation: OperationTransaction.SIM_BLANCHE }, nbrPageData);
        });
        this.sharedService.isLoadingDemands().pipe(takeUntil(this.destroy$)).subscribe((spinner: boolean) => {
            this.spinner = spinner;
        });
    }

    public filter(filterData: Object): void {
        this.sharedService.fetchDemands({ ...filterData, operation: OperationTransaction.SIM_BLANCHE })
    }

    public onPageChange(event: number): void {
        this.sharedService.getDataFilterDemands().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.sharedService.fetchDemands(filterData, JSON.stringify(event + 1))
        });
    }

    public navigateByUrl(params: PageAction): void {
        const number_demand = params.data ? params.data?.["numero_demande"] : null;
        const ref = params.action;
        const operation = OperationTransaction.SIM_BLANCHE;
        const queryParams = { ref, operation };
        let routePath: string = '';

        switch (params.action) {
            case "invoice-white-sim": routePath = `${INVOICE}/${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "open-folder-white-sim": routePath = `${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            case "mass-edit-white-sim":
            case "simple-add-white-sim": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.SIM_BLANCHE } }); break;
            case "mass-add-white-sim": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.SIM_BLANCHE_EN_MASSE } }); break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
