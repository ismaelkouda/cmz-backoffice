import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BADGE_ETAPE, T_BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT, T_BADGE_ETAT } from './../../../../../shared/constants/badge-etat.contant';
import { combineLatest, Observable } from 'rxjs';
import { treatmentMonitoringFilterInterface } from '../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Folder } from '../../../../../shared/interfaces/folder';
import { TreatmentMonitoringApiService } from '../../data-access/treatment-monitoring/services/treatment-monitoring-api.service';

const step_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const state_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction = { data: Folder, action: 'open-folder-treatment-monitoring', view: 'page' };

    @Component({
        selector: 'app-treatment-monitoring',
        templateUrl: './treatment-monitoring.component.html'
    })

    export class TreatmentMonitoringComponent implements OnInit {
        public module: string;
        public subModule: string;
        public pagination$: Observable<Paginate<Folder>>;
        public filterData: treatmentMonitoringFilterInterface;
        public listTreatmentMonitoring$: Observable<Array<Folder>>;
        public treatmentMonitoringSelected$: Observable<Folder>;
        public listOperations: Array<string> = [];
        public listStepTreatmentMonitoring : Array<T_BADGE_ETAPE> = step_values;
        public listStateTreatmentMonitoring : Array<T_BADGE_ETAT> = state_values;
        public listApplicants$: Observable<any[]>;

        constructor(private router: Router, private sharedService: SharedService,
            private activatedRoute: ActivatedRoute,
            private treatmentMonitoringApiService: TreatmentMonitoringApiService) {
        }

        ngOnInit(): void {
            this.activatedRoute.data.subscribe((data) => {
                this.module = data.module;
                this.subModule = data.subModule[1];
            });
            this.sharedService.fetchApplicants();
            this.listApplicants$ = this.sharedService.getApplicants();
            this.listTreatmentMonitoring$ = this.treatmentMonitoringApiService.getTreatmentMonitoring();
            this.pagination$ = this.treatmentMonitoringApiService.getTreatmentMonitoringPagination();
            combineLatest([
                this.treatmentMonitoringApiService.getDataFilterTreatmentMonitoring(),
                this.treatmentMonitoringApiService.getDataNbrPageTreatmentMonitoring()
            ]).subscribe(([filterData, nbrPageData]) => {
                this.treatmentMonitoringApiService.fetchTreatmentMonitoring(filterData, nbrPageData);
            });
        }

        public filter(filterData: treatmentMonitoringFilterInterface): void {
            this.filterData = filterData;
            this.treatmentMonitoringApiService.fetchTreatmentMonitoring(filterData)
        }

        public onPageChange(event: number): void {
            this.treatmentMonitoringApiService.fetchTreatmentMonitoring(this.filterData, JSON.stringify(event + 1))
        }

        public navigateByUrl(params: PageAction): void {
            const number_demand = params.data ? params.data["numero_demande"] : null;
            const ref = params.action;
            const operation = params.data.operation;
            const queryParams = { ref, operation };
            let routePath: string = '';

            switch (params.action) {
            case "open-folder-treatment-monitoring": routePath = `${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
            }
        }
    }
