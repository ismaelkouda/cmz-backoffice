import { IStatistiquesBox } from './../../../../../shared/interfaces/statistiquesBox.interface';
import { ComptabiliteService } from './../../data-access/comptabilite.service';
import { StateFactureService } from './../../data-access/facture/state-facture.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    Facture,
    FileAttentePaginatedResponse,
    GlobalStats,
} from '../../data-access/facture';
import { BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../../../../../shared/services/shared-data.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { handle } from '../../../../../shared/functions/api.function';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { MappingService } from '../../../../../shared/services/mapping.service';
import {
    BADGE_ETAT_FACTURE,
    T_BADGE_ETAT_FACTURE,
} from '../../../../../shared/constants/badge-etat-facture.contant';

const status_values = [
    BADGE_ETAT_FACTURE.POSTEE,
    BADGE_ETAT_FACTURE.REPORTEE,
    BADGE_ETAT_FACTURE.SOLDEE,
    BADGE_ETAT_FACTURE.REJETEE,
];
const indexBoxClickable = [2, 3, 4] as const;
type PageAction = { data: Object; action: 'form-dossier'; view: 'page' };

@Component({
    selector: `app-facture`,
    templateUrl: `./facture.component.html`,
    styles: [
        `
            .panels-p-dropdown p-dropdown {
                height: 100% !important;
                display: flex;
                align-items: center;
            }
            .boxClickable {
                cursor: pointer;
            }
        `,
    ],
})
export class FactureComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination: Paginate<Facture> | void;
    public listFactures: Array<Facture> | undefined = [];
    public spinner: boolean = false;
    public selectedFacture: Object | null;
    public filterData: Object;
    public currentPage: string;
    public listStatus: Array<T_BADGE_ETAT_FACTURE> = status_values;
    public typePaiement: Array<string> = [];
    public listOperations: Array<string> = [];
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public indexBoxClickable = indexBoxClickable;

    constructor(
        private loadingBarService: LoadingBarService,
        private toastrService: ToastrService,
        private activatedRoute: ActivatedRoute,
        private stateFactureService: StateFactureService,
        private comptabiliteService: ComptabiliteService,
        private sharedDataService: SharedDataService,
        private router: Router,
        private mappingService: MappingService
    ) {
        this.listOperations = this.mappingService.listOperations;
    }

    ngOnInit(): void {
        this.getTchesBoxValues();
        this.sharedDataService.postComptabiliteFacture().subscribe(() => {
            this.pageCallback();
        });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data?.module;
            this.subModule = data?.subModule[0];
        });
        this.filterData = this.stateFactureService.getFilterFactureState();
        this.currentPage =
            this.stateFactureService.getCurrentPageFactureState();
        this.selectedFacture = this.stateFactureService.getItemSelectedState();
        this.pageCallback(this.filterData, this.currentPage);
        this.spinner = true;
    }

    async pageCallback(dataToSend = {}, nbrPage: string = '1'): Promise<any> {
        const response: FileAttentePaginatedResponse | void = await handle(
            () =>
                this.comptabiliteService.PostGestionFactureFacture(
                    dataToSend,
                    nbrPage
                ),
            this.toastrService,
            this.loadingBarService
        );
        if (response?.['error'] === false)
            this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(
        response: FileAttentePaginatedResponse | void
    ): void {
        this.getTchesBoxValues(response?.['data']);
        this.listFactures = response?.['data']['data']['data'];
        this.pagination = response?.['data']?.data;
        this.spinner = false;
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.pageCallback(filterData);
    }

    public onPageChange(event: number): void {
        this.pageCallback(this.filterData, JSON.stringify(event + 1));
    }

    public navigateByUrl(params: PageAction): void {
        const numero_demande = params.data['numero_demande'];
        const ref = params.action;
        const operation = params.data?.['operation'];
        const current_page = this.pagination?.['current_page'] || 1;
        const filter =
            this.stateFactureService?.setFilterFactureState(this.filterData) ??
            null;

        const queryParams = { ref, current_page, filter, operation };

        let routePath: string;

        switch (params.action) {
            case 'form-dossier':
                routePath = `${numero_demande}`;
                break;
        }

        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    ngOnDestroy(): void {
        this.stateFactureService.clearFacture();
    }

    private getTchesBoxValues(rapport: GlobalStats | {} = {}): void {
        this.statistiquesBox = [
            {
                id: 0,
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Factures',
                count: rapport?.['total_factures'] || 0,
                taux: rapport?.['pourcentage_factures'],
            },
            {
                id: 1,
                cardBgColor: 'rgb(254, 154, 46)',
                legend: '# Postés',
                count: rapport?.['total_postes'] || 0,
                taux: rapport?.['pourcentage_en_attentes'],
            },
            {
                id: 2,
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Reportés',
                count: rapport?.['total_reportes'] || 0,
                taux: rapport?.['pourcentage_immediats'] || 0,
            },
            {
                id: 3,
                cardBgColor: '#27ae60',
                legend: '# Soldés',
                count: rapport?.['total_soldes'] || 0,
                taux: rapport?.['pourcentage_differes'] || 0,
            },
            {
                id: 4,
                cardBgColor: '#e74c3c',
                legend: '# Rejetés',
                count: rapport?.['total_rejetes'] || 0,
                taux: rapport?.['pourcentage_immediats'] || 0,
            },
        ];
    }

    public onBoxClick(statistiqueBox: IStatistiquesBox) {
        type IndexBoxClickable = typeof indexBoxClickable[number];
        if (
            indexBoxClickable.includes(statistiqueBox.id as IndexBoxClickable)
        ) {
            switch (statistiqueBox.id) {
                case 2:
                    this.filterData = { statut: 'reportée' };
                    break;
                case 3:
                    this.filterData = { statut: 'soldée' };
                    break;
                case 4:
                    this.filterData = { statut: 'rejetée' };
                    break;
            }
            this.pageCallback(this.filterData);
        }
    }
}
