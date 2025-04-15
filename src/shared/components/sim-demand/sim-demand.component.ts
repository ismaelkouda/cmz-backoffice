import { IStatistiquesBox } from '../../interfaces/statistiquesBox.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { OperationTransaction, T_OPERATION } from '../../enum/OperationTransaction.enum';
import { Paginate } from '../../interfaces/paginate';
import { SharedService } from '../../services/shared.service';
import { SimDemand } from '../../interfaces/details-mobile-subscriptions.interface';
import { BADGE_ETAPE } from '../../constants/badge-etape.constant';
import { BADGE_ETAT } from '../../constants/badge-etat.contant';
import { Subject, takeUntil } from 'rxjs';

type TYPEVIEW = "open-folder-mobile-subscription" | "open-folder-white-sim" | "open-folder-treatment-monitoring" | "view-white-sim-card" | "open-folder-claims";
const TYPEVIEW_VALUES: TYPEVIEW[] = ["open-folder-mobile-subscription", "open-folder-white-sim", "open-folder-treatment-monitoring", "view-white-sim-card", "open-folder-claims"];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: `app-sim-demand`,
    templateUrl: `./sim-demand.component.html`,
    styles: [`.container-box { display: flex; gap: 2px; margin-bottom: 1rem;align-self: stretch;}`]
})

export class SimDemandComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination: Paginate<SimDemand> | void;

    public urlParamRef: TYPEVIEW;
    public urlParamId: string | null;
    public urlParamTypeDemand: T_OPERATION;
    public urlParamNumberDemand: string;

    public displayUrlErrorPage: boolean = false;
    public listEtapeLigne: Array<any> = [];
    public listEtatLigne: Array<any> = [];
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public BADGE_ETAPE = BADGE_ETAPE;
    public BADGE_ETAT = BADGE_ETAT;
    public listSim: Array<SimDemand>;
    private destroy$ = new Subject<void>();

    constructor(public toastrService: ToastrService, private activatedRoute: ActivatedRoute,
        private sharedService: SharedService, private location: Location) {
        Object.values(BADGE_ETAPE).forEach((item) => { this.listEtapeLigne.push(item); });
        Object.values(BADGE_ETAT).forEach((item) => { this.listEtatLigne.push(item); });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamId = params?.["id"];
            this.urlParamRef = params?.["ref"];
            this.urlParamTypeDemand = params?.["operation"];
        });
        this.urlParamNumberDemand = this.activatedRoute.snapshot.paramMap.get('number_demand') ?? '';
        this.getParamsInUrl();
        this.getTchesBoxValues();
    }

    private getParamsInUrl(): void {
        if (!isTypeView(this.urlParamRef) || !Object.values(OperationTransaction).includes(this.urlParamTypeDemand as OperationTransaction)) {
            this.displayUrlErrorPage = true;
        } else {
            this.sharedService.fetchSimDemand({ numero_demande: this.urlParamNumberDemand });
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
        this.sharedService.getDataFilterSimDemand().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.sharedService.fetchSimDemand(filterData, JSON.stringify(event + 1))
        });
    }

    public onGoToBack(): void {
        this.location.back();
    }

    public getEtapeBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION: return "badge-dark";
            case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
        }
        return "badge-dark";
    }

    public getEtatBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION:
                if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
                if (data?.traitement === BADGE_ETAT.RECU) return "badge-dark";
                break;

            case BADGE_ETAPE.TRAITEMENT:
                if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
                if (data?.traitement === BADGE_ETAT.TERMINE) return "badge-success";
                break;
        }
        return "badge-dark";
    }

    getTchesBoxValues(rapport: Object = {}): void {
        this.statistiquesBox = [
            {
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Tâches',
                count: rapport?.["total_taches"] || '0',
                taux: rapport?.["pourcentage_taches"] || '0'
            },
            {
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Non Affectées',
                count: rapport?.["total_non_affectes"] || '0',
                taux: rapport?.["pourcentage_non_affectes"] || '0'
            },
            {
                cardBgColor: 'rgb(155, 89, 182)',
                legend: '# Affectées',
                count: rapport?.["total_affectes"] || '0',
                taux: rapport?.["pourcentage_affectes"] || '0'
            },
            {
                cardBgColor: 'rgb(39, 174, 96)',
                legend: '# Terminées',
                count: rapport?.["total_traite_termines"] || '0',
                taux: rapport?.["pourcentage_traite_termines"] || '0'
            },
            {
                cardBgColor: 'rgb(255, 102, 0)',
                legend: '# Échouées',
                count: rapport?.["total_traite_echoues"] || '0',
                taux: rapport?.["pourcentage_traite_echoues"] || '0'
            },
            {
                cardBgColor: 'rgb(231, 76, 60)',
                legend: '# Rejetées',
                count: rapport?.["total_traites_rejetes"] || '0',
                taux: rapport?.["pourcentage_traites_rejetes"] || '0'
            }
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}