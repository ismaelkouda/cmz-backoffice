import { PatrimoinesService } from '../../data-access/patrimoines.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { Paginate } from '../../../../../shared/interfaces/api-response';
import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';
import { SharedDataService } from '../../../../../shared/services/shared-data.service';
import { StateWhiteSimCardService } from '../../data-access/white-sim-card/state-approbation.service';
import { handle } from '../../../../../shared/functions/api.function';
import { DossierWhiteSimCard, WhiteSimCardPaginatedResponse } from '../../data-access/white-sim-card/table-white-sim-card';

type PageAction = { 'data': Object, 'action': 'ajouter', 'view': 'page' } | { 'data': Object, 'action': 'détails', 'view': 'page' };

@Component({
    selector: "app-white-sim-card",
    templateUrl: "./white-sim-card.component.html",
    styleUrls: [`./white-sim-card.component.scss`]
})

export class WhiteSimCardComponent implements OnInit {

    public module: string;
    public subModule: string;
    public pagination: Paginate<DossierWhiteSimCard>|void;
    public listWhiteSimCard: Array<DossierWhiteSimCard> = [];
    public spinner: boolean = false;
    public selectedWhiteSimCard: DossierWhiteSimCard|undefined;
    public filterData: Object;
    public currentPage: string;
    public statistiquesBox: Array<IStatistiquesBox> = [];

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private sharedDataService: SharedDataService, private excelService: ExcelService,
        private patrimoinesService: PatrimoinesService, private stateWhiteSimCardService: StateWhiteSimCardService,
        private toastrService: ToastrService, private loadingBar: LoadingBarService) {
        }

    ngOnInit(): void {
        this.sharedDataService.postPatrimoineWhiteSimCard().subscribe(() => {
            this.pageCallback();
        });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.filterData = this.stateWhiteSimCardService.getFilterWhiteSimCardState();
        this.currentPage = this.stateWhiteSimCardService.getCurrentPageWhiteSimCardState();
        this.selectedWhiteSimCard = this.stateWhiteSimCardService.getItemSelectedState();
        this.pageCallback(this.filterData, this.currentPage);
        this.spinner = true;
        this.getTchesBoxValues();
    }
    
    async pageCallback(dataToSend: Object = {}, nbrPage: string = "1"): Promise<any> {
        const response: WhiteSimCardPaginatedResponse|null = await handle<WhiteSimCardPaginatedResponse>(() => this.patrimoinesService.PostPatrimoineSimCartonSimBlancheAllPage(dataToSend, nbrPage), this.toastrService, this.loadingBar);
        if (response && response.error === false) this.handleSuccessfulPageCallback(response);
    }
    private handleSuccessfulPageCallback(response: any): void {
        this.listWhiteSimCard = response?.data?.data?.data;
        this.getTchesBoxValues(response?.data);
        this.pagination = response?.["data"]?.data;
        this.spinner = false;
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.pageCallback(filterData);
    }

    public onPageChange(event: number) {
        this.pageCallback(this.filterData, JSON.stringify(event + 1));
    }
    
    public navigateByUrl(params: PageAction): void {
        const id = params.data ? params.data["id"] : null;
        const ref = params.action;
        const current_page = this.pagination?.["current_page"] || 1;
        const filter = this.stateWhiteSimCardService?.setFilterWhiteSimCardState(this.filterData) ?? null;
    
        const queryParams = {
            ref,
            current_page,
            filter
        };
    
        let routePath: string = '';
        
        switch (params.action) {
            case "détails":
                routePath = `${id}`;
                break;
        }

        this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams });
    }
    
    ngOnDestroy(): void {
        this.stateWhiteSimCardService.clearWhiteSimCard();
    }

    getTchesBoxValues(rapport: Object = {}): void {
        this.statistiquesBox = [
            {
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# Lots disponibles',
                count: rapport?.["total_lots"] || 0,
                taux: null
            },
            {
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Cartes SIM',
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

}