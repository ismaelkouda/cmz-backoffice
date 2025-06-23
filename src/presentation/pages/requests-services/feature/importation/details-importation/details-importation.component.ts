import { IMPORTATION_LINE_STEP } from './data-access/interfaces/importation-line-step.constant';
import { IStatistiquesBox } from '../../interfaces/statistiquesBox.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginate } from '../../interfaces/paginate';
import { SharedService } from '../../services/shared.service';
import { DetailsImportationInterface } from './data-access/interfaces/details-importation.interface';
import { Subject, takeUntil } from 'rxjs';

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
    public pagination: Paginate<Array<DetailsImportationInterface>> | void;

    public urlParamRef: TYPEVIEW;
    public urlParamId: string | null;
    public urlParamNumberDemand: string;

    public displayUrlErrorPage: boolean = false;
    public listStepLine: Array<any> = [];
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public IMPORTATION_LINE_STEP = IMPORTATION_LINE_STEP;
    public listSim: Array<DetailsImportationInterface>;
    private destroy$ = new Subject<void>();

    constructor(
        public toastrService: ToastrService,
        private activatedRoute: ActivatedRoute,
        private sharedService: SharedService,
        private router: Router
    ) {
        Object.values(IMPORTATION_LINE_STEP).forEach((item) => {
            this.listStepLine.push(item);
        });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
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
            this.getTitle();
            this.sharedService.fetchSimDemand({
                numero_demande: this.urlParamNumberDemand,
            });
            this.sharedService.getSimDemand().subscribe((value) => {
                this.listSim = value;
            });
            this.sharedService.getSimDemandPagination().subscribe((value) => {
                this.pagination = value;
            });
        }
    }

    public filter(filterData: Object): void {
        this.sharedService.fetchSimDemand(filterData);
    }

    public onPageChange(event: number): void {
        this.sharedService
            .getDataFilterSimDemand()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.sharedService.fetchSimDemand(
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
        this.router.navigateByUrl(
            `/${this.getTitle().moduleRoute}/${this.getTitle().subModuleRoute}`
        );
    }

    public getTitle(): {
        module: string;
        moduleRoute: string;
        subModule: string;
        subModuleRoute: string;
    } {
        switch (this.urlParamRef) {
            case 'open-folder-importation':
                return {
                    module: 'REQUESTS_SERVICES',
                    moduleRoute: 'requests-services',
                    subModule: 'MOBILE_SUBSCRIPTIONS',
                    subModuleRoute: 'mobile-subscriptions',
                };
            default:
                return {
                    module: '',
                    moduleRoute: '',
                    subModule: '',
                    subModuleRoute: '',
                };
        }
    }
}
