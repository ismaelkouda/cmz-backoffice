import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OperationTransaction } from './../../../../../shared/enum/OperationTransaction.enum';
import { BADGE_ETAPE, T_BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT, T_BADGE_ETAT } from './../../../../../shared/constants/badge-etat.contant';
import { CommandWhiteSim } from '../../data-access/white-sim/interfaces/white-sim.interface';
import { Observable, Subject, takeUntil } from 'rxjs';
import { INVOICE } from '../../../requests-products/requests-products-routing.module';
import { FORM } from '../../../requests-products/requests-products-routing.module';
import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';
import { CommandWhiteSimApiService } from '../../data-access/white-sim/services/white-sim-api.service';
import { Paginate } from '../../../../../shared/interfaces/paginate';

const step_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const state_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction = { data: CommandWhiteSim, action: 'open-folder-white-sim' | 'invoice-white-sim' | 'mass-edit-white-sim' | 'simple-add-white-sim' | 'mass-add-white-sim', view: 'page' };

@Component({
    selector: 'app-white-sim',
    templateUrl: './white-sim.component.html'
})

export class WhiteSimComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination: Paginate<CommandWhiteSim> | void;
    public filterData: Object;
    public currentPage: string;
    public listStepCommandWhiteSim: Array<T_BADGE_ETAPE> = step_values;
    public listStateCommandWhiteSim: Array<T_BADGE_ETAT> = state_values;
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public listCommandWhiteSim$: Observable<Array<CommandWhiteSim>>;
    public commandWhiteSimSelected: CommandWhiteSim;
    public listApplicants$: Observable<any[]>;
    private destroy$ = new Subject<void>();

    constructor(private router: Router, private sharedService: SharedService,
        private activatedRoute: ActivatedRoute, 
        private commandWhiteSimApiService: CommandWhiteSimApiService) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
        this.listCommandWhiteSim$ = this.commandWhiteSimApiService.getCommandWhiteSim();
        // this.commandWhiteSimApiService.getCommandWhiteSim().pipe(takeUntil(this.destroy$)).subscribe((command) => {
        //     this.listCommandWhiteSim = command;
        // });
        this.commandWhiteSimApiService.getDataFilterCommandWhiteSim().pipe(takeUntil(this.destroy$)).subscribe((command) => {
            this.filterData = command;
        });
        this.commandWhiteSimApiService.fetchCommandWhiteSim(this.filterData, this.currentPage);
        this.commandWhiteSimApiService.getCommandWhiteSimPagination().pipe(takeUntil(this.destroy$)).subscribe((value) => {
            this.pagination = value;
        });
        this.commandWhiteSimApiService.getCommandWhiteSimSelected().pipe(takeUntil(this.destroy$)).subscribe((command: CommandWhiteSim) => {
            this.commandWhiteSimSelected = command;
        });
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.commandWhiteSimApiService.fetchCommandWhiteSim(filterData)
    }

    public onPageChange(event: number): void {
        this.commandWhiteSimApiService.fetchCommandWhiteSim(this.filterData, JSON.stringify(event + 1))
    }

    public navigateByUrl(params: PageAction): void {
        const number_demand = params.data ? params.data?.["numero_demande"] : null;
        const ref = params.action;
        const operation = OperationTransaction.SIM_BLANCHE;
        const current_page = this.pagination?.['current_page'] || 1;
        const queryParams = { ref, operation, current_page };
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
