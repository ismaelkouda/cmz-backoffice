import { IMPORTATION_LINE_STEP } from './data-access/interfaces/importation-line-step.constant';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetailsImportationInterface } from './data-access/interfaces/details-importation.interface';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { IStatisticsBox } from '../../../../../../shared/interfaces/statistiquesBox.interface';
import { ImportationService } from '../../../data-access/importation/service/importation-api.service';
import { SIM_IMPORTATION } from '../../../requests-services-routing.module';
import { PATRIMONY } from '../../../../../../shared/routes/routes';
import { ApnInterface } from '../../../../../../shared/interfaces/apn.interface';
import { SharedService } from '../../../../../../shared/services/shared.service';

type TYPEVIEW = 'open-folder-importation';
const TYPEVIEW_VALUES: TYPEVIEW[] = ['open-folder-importation'];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: `app-details-importation`,
    templateUrl: './details-importation.component.html',
    styles: [
        `
            .container-box {
                display: flex;
                gap: 2px;
                margin-bottom: 1rem;
                align-self: stretch;
            }
        `,
    ],
})
export class DetailsImportationComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<
        Paginate<Array<DetailsImportationInterface>>
    >;
    public urlParamRef: TYPEVIEW;
    public urlParamId: string | null;
    public urlParamNumberDemand: string;
    public displayUrlErrorPage: boolean = false;
    public listStepLine: Array<any> = [];
    public statistiquesBox: Array<IStatisticsBox> = [];
    public IMPORTATION_LINE_STEP = IMPORTATION_LINE_STEP;
    public listSim$: Observable<Array<DetailsImportationInterface>>;
    public listApn$: Observable<Array<ApnInterface>>;
    private destroy$ = new Subject<void>();

    constructor(
        public toastrService: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private importationService: ImportationService,
        private sharedService: SharedService
    ) {
        Object.values(IMPORTATION_LINE_STEP).forEach((item) => {
            this.listStepLine.push(item);
        });
    }

    ngOnInit(): void {
        this.sharedService.fetchApn();
        this.listApn$ = this.sharedService.getApn();
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[5];
        });
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamId = params?.['id'];
            this.urlParamRef = params?.['ref'];
        });
        this.urlParamNumberDemand =
            this.activatedRoute.snapshot.paramMap.get('number_demand') ?? '';
        this.getParamsInUrl();
        this.getTchesBoxValues();
    }

    private getParamsInUrl(): void {
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
        } else {
            this.importationService.fetchSimDemand({
                numero_demande: this.urlParamNumberDemand,
            });
            this.pagination$ = this.importationService.getSimDemandPagination();
            this.listSim$ = this.importationService.getSimDemand();
        }
    }

    public filter(filterData: Object): void {
        this.importationService.fetchSimDemand({
            ...filterData,
            numero_demande: this.urlParamNumberDemand,
        });
    }

    public onPageChange(event: number): void {
        this.importationService
            .getDataFilterSimDemand()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.importationService.fetchSimDemand(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    getTchesBoxValues(rapport: Object = {}): void {
        this.statistiquesBox = [
            {
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Tâches',
                count: rapport?.['total_taches'] || '0',
                taux: rapport?.['pourcentage_taches'] || '0',
            },
            {
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Non Affectées',
                count: rapport?.['total_non_affectes'] || '0',
                taux: rapport?.['pourcentage_non_affectes'] || '0',
            },
            {
                cardBgColor: 'rgb(155, 89, 182)',
                legend: '# Affectées',
                count: rapport?.['total_affectes'] || '0',
                taux: rapport?.['pourcentage_affectes'] || '0',
            },
            {
                cardBgColor: 'rgb(39, 174, 96)',
                legend: '# Terminées',
                count: rapport?.['total_traite_termines'] || '0',
                taux: rapport?.['pourcentage_traite_termines'] || '0',
            },
            {
                cardBgColor: 'rgb(255, 102, 0)',
                legend: '# Échouées',
                count: rapport?.['total_traite_echoues'] || '0',
                taux: rapport?.['pourcentage_traite_echoues'] || '0',
            },
            {
                cardBgColor: 'rgb(231, 76, 60)',
                legend: '# Rejetées',
                count: rapport?.['total_traites_rejetes'] || '0',
                taux: rapport?.['pourcentage_traites_rejetes'] || '0',
            },
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onGoToBack(): void {
        this.router.navigateByUrl(`/${PATRIMONY}/${SIM_IMPORTATION}`);
    }
}
