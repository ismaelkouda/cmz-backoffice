import { IStatistiquesBox } from './../../../../../shared/interfaces/statistiquesBox.interface';
import { ComptabiliteService } from './../../data-access/comptabilite.service';
import { StateFactureService } from './../../data-access/facture/state-facture.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Paginate } from "../../../../../shared/interfaces/api-response";
import { Facture, FileAttentePaginatedResponse, GlobalStats } from "../../data-access/facture";
import { BADGE_ETAT } from "../../../../../shared/constants/badge-etat.contant";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { SharedDataService } from "../../../../../shared/services/shared-data.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { handle } from "../../../../../shared/functions/api.function";

const etat_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
const indexBoxClickable = [3, 4] as const;

@Component({
    selector: `app-facture`,
    templateUrl: `./facture.component.html`,
    styles: [`.panels-p-dropdown p-dropdown {height: 100% !important; display: flex; align-items: center;}
                .boxClickable { cursor: pointer;}`]
})

export class FactureComponent implements OnInit, OnDestroy {

    public module: string;
    public subModule: string;
    public pagination: Paginate<Facture>|void;
    public listFactures: Array<Facture>|undefined = [];
    public spinner: boolean = false;
    public selectedFacture: Object | null;
    public filterData: Object;
    public currentPage: string;
    public listEtatFacture: Array<string> = etat_values;
    public typePaiement: Array<string> = [];
    public listOperations: Array<string> = [];
    public statistiquesBox: Array<IStatistiquesBox> = [];
    public indexBoxClickable = indexBoxClickable;

    constructor(private loadingBarService: LoadingBarService, private toastrService: ToastrService,
        private activatedRoute: ActivatedRoute, private stateFactureService: StateFactureService,
        private comptabiliteService: ComptabiliteService, private sharedDataService: SharedDataService) {
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
        this.currentPage = this.stateFactureService.getCurrentPageFactureState();
        this.selectedFacture = this.stateFactureService.getItemSelectedState();
        this.pageCallback(this.filterData, this.currentPage);
        this.spinner = true;
    }

    async pageCallback(dataToSend = {}, nbrPage: string = "1"): Promise<any> {
        const response: FileAttentePaginatedResponse | void = await handle(() => this.comptabiliteService.PostGestionFactureFacture(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        if (response?.["error"] === false) this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: FileAttentePaginatedResponse | void ): void {
        this.getTchesBoxValues(response?.["data"]);
        this.listFactures = response?.["data"]["data"]["data"];
        this.pagination = response?.["data"]?.data;
        this.spinner = false;
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.pageCallback(filterData);
    }
    
    public onPageChange(event: number): void {
        this.pageCallback(this.filterData, JSON.stringify(event + 1))
    }

    ngOnDestroy(): void {
        this.stateFactureService.clearFacture();
    }

    private getTchesBoxValues(rapport: GlobalStats|{} = {}): void {
        console.log('rapport', rapport)
            this.statistiquesBox = [
                {
                    id: 1,
                    cardBgColor: 'rgb(52, 152, 219)',
                    legend: '# Facture',
                    count: rapport?.["total_factures"] || 0,
                    taux: rapport?.["pourcentage_factures"]
                },
                {
                    id: 2,
                    cardBgColor: 'rgb(52, 152, 219)',
                    legend: '# En-attente',
                    count: rapport?.["total_en_attentes"] || 0,
                    taux: rapport?.["pourcentage_en_attentes"]
                },
                {
                    id: 3,
                    cardBgColor: '#27ae60',
                    legend: '# Differé',
                    count: rapport?.["total_differes"] || 0,
                    taux: rapport?.["pourcentage_differes"] || 0
                },
                {
                    id: 4,
                    cardBgColor: '#e74c3c',
                    legend: '# Immediat',
                    count: rapport?.["total_immediats"] || 0,
                    taux: rapport?.["pourcentage_immediats"] || 0
                }
            ];
            console.log('this.statistiquesBox', this.statistiquesBox)
    }

    public onBoxClick(statistiqueBox: IStatistiquesBox) {
        type IndexBoxClickable = (typeof indexBoxClickable)[number];
        if(indexBoxClickable.includes(statistiqueBox.id as IndexBoxClickable)) {
            switch (statistiqueBox.id) {
                case 3: this.filterData = {sla: "differe"}; break;
                case 4: this.filterData = {sla: "immediat"}; break;
            }
            this.pageCallback(this.filterData)
        }
    }
}