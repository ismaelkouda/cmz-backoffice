import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { TYPE_PRODUITS } from '../../../../../shared/enum/type-produits.enum';
import { DemandesProduitsService } from '../../data-access/demandes-produits.service';
import { IStatistiquesBox } from '../../../../../shared/interfaces/statistiquesBox.interface';
import { BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { BADGE_ETAPE } from '../../../../../shared/constants/badge-etape.constant';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { Pargination } from '../../../../../shared/table/pargination';
import { StateAchatProduitsService } from '../../data-access/achat-produits/state-achat-produits.service';
import { handle } from '../../../../../shared/functions/api.function';
import { DemandeService } from '../../../demandes/data-access/demande.service';
import { MappingService } from '../../../../../shared/services/mapping.service';
import { PatrimoineService } from '../../../patrimoine/data-access/patrimoine.service';

type TYPEVIEW = "détails";
const TYPEVIEW_VALUES: TYPEVIEW[] = ["détails"];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: `app-details-achat-produits`,
    templateUrl: `./details-achat-produits.component.html`,
    styles: [`.container-box { display: flex; gap: 2px; margin-bottom: 1rem;align-self: stretch;}`]
})

export class DetailsAchatProduitsComponent implements OnInit {
    public spinner: boolean = true;
    public module: string;
    public subModule: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public urlParamRef: TYPEVIEW;
    public urlParamId: string;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public urlParamOperation: string;
    public filterData: Object;

    public listProduits: Array<Object>;
    public selectedAchat: Object | undefined;
    public listTypeProduits: Array<string> = [];
    public displayUrlErrorPage: boolean = false;
    public listEtapeLigne: Array<any> = [];
    public listEtatLigne: Array<any> = [];
    public listOperations: Array<any> = [];
    public statistiquesBox: Array<IStatistiquesBox> = [];

    public isLoadingTitle: boolean = true;

    public BADGE_ETAPE = BADGE_ETAPE;
    public BADGE_ETAT = BADGE_ETAT;

    constructor(public toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private demandesProduitsService: DemandesProduitsService, private activatedRoute: ActivatedRoute,
        private excelService: ExcelService, private demandeService: DemandeService,
        private mappingService: MappingService, public patrimoineService: PatrimoineService,
        private stateAchatProduitsService: StateAchatProduitsService, private location: Location) {
        Object.values(TYPE_PRODUITS).forEach((item) => { this.listTypeProduits.push(item); });
        this.listOperations = this.mappingService.listOperations
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.getParamsInUrl();
        this.getTchesBoxValues();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.["ref"];
            this.urlParamCurrentPage = params?.["urlParamCurrentPage"];
            this.urlParamOperation = params?.["operation"];
            this.urlParamFilter = this.stateAchatProduitsService.getFilterAchatProduitsState(params?.["filter"]);
        });
        this.urlParamId = this.activatedRoute.snapshot.paramMap.get('numero_demande');
        
        if (!this.urlParamId || !this.urlParamRef) {
            this.displayUrlErrorPage = true;
            this.isLoadingTitle = false;
        } else {
            if (this.urlParamId) this.pageCallback(this.urlParamFilter, this.urlParamCurrentPage);
        }
    }

    async pageCallback(urlParamFilter = {}, urlParamCurrentPage: string = "1"): Promise<any> {
        const response: any = await handle(() => this.demandeService.GetDemandeServiceByTransaction(urlParamFilter, urlParamCurrentPage), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulPageCallback(response);
    }
    private handleSuccessfulPageCallback(response: Object): void {
        const listAchatProduits = response?.["data"]?.data;
        this.getDossierSelected(listAchatProduits);
    }
    private getDossierSelected(listAchatProduits: Array<Object>): void {
        this.selectedAchat = listAchatProduits.find((dossier) => dossier?.['numero_demande'] == this.urlParamId);
        if (this.selectedAchat) {
            // this.sharedDataService.postGestionStocksDetailsCartesSim().subscribe(() => {
            //     this.postGestionStocksDetailsCartesSim({...this.filterData, id: this.selectedCarteSim?.["id"]});
            // });
            this.getAllProduits();
        } else {
            this.displayUrlErrorPage = true;
            this.isLoadingTitle = false;
        }
    }

    async getAllProduits(dataToSend: Object = this.filterData, nbrPage: string = "1") {
        const response: any = await handle(() => this.patrimoineService.GetAllTransactions({...dataToSend, numero_demande: this.selectedAchat?.["numero_demande"], operation: this.urlParamOperation, tenant_code: this.mappingService.tenant.tenant_code}, nbrPage), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulGetAllDemandes(response);
    }

    private handleSuccessfulGetAllDemandes(response: any): void {
        this.getTchesBoxValues(response?.["data"]);
        this.listProduits = response?.["data"]?.["data"];
        this.isLoadingTitle = false;
        this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
        this.spinner = false;
        this.stateAchatProduitsService.setCurrentPageAchatProduitsState(this.urlParamCurrentPage);
        this.stateAchatProduitsService.setFilterAchatProduitsState(this.urlParamFilter);
        this.stateAchatProduitsService.setItemSelectedState(this.selectedAchat);
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.getAllProduits(filterData);
    }

    public onPageChange(event: number): void {
        this.getAllProduits(this.filterData, JSON.stringify(event + 1))
    }

    public onExportExcel(): void {
        const data = this.listProduits.map((item: any) => ({
            "Date/Heure": item?.created_at,
            "N° Tâche": item?.transaction,
            "MSISDN": item?.msisdn,
            "IMSI": item?.imsi,
            "Etape": item?.statut,
            "Etat": item?.traitement,
            "Date Etat": (item.traitement === 'abandonné' ? item?.date_cloture : item?.date_traitement),
            "Rapport": item?.code_rapport,
        }));
        this.excelService.exportAsExcelFile(data, `Liste_des_demandes_du_dossier_${this.selectedAchat?.["numero_demande"]}`);
    }

    public onGoToBack(): void {
        this.location.back();
    }

    public getEtapeBadge(data: any): string {
        switch (data?.statut) {
          case BADGE_ETAPE.SOUMISSION: return "badge-dark";
          case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
          case BADGE_ETAPE.FINALISATEUR: return "badge-info";
          case BADGE_ETAPE.CLOTURE: return "badge-success";
        }
      }

    public getEtatBadge(data: any): string {
        switch (data?.statut) {
          case BADGE_ETAPE.SOUMISSION:
            if (data?.traitement === BADGE_ETAT.EN_ATTENTE) return "badge-dark";
            if (data?.traitement === BADGE_ETAT.APPROUVE) return "badge-success";
            if (data?.traitement === BADGE_ETAT.REJETE) return "badge-danger";
            if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
            if (data?.traitement === BADGE_ETAT.RECU) return "badge-dark";
            break;
    
          case BADGE_ETAPE.TRAITEMENT:
            if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
            if (data?.traitement === BADGE_ETAT.TERMINE) return "badge-success";
            break;
    
          case BADGE_ETAPE.FINALISATEUR:
            if (data?.traitement === BADGE_ETAT.EN_ATTENTE) { return "badge-warning"; }
            if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-warning"; }
            if (data?.traitement === BADGE_ETAT.LIVRE) { return "badge-primary"; }
            break;
    
          case BADGE_ETAPE.CLOTURE:
            if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-success"; }
      if (data?.traitement === BADGE_ETAT.TERMINE) { return "badge-success"; }
            if (data?.traitement === BADGE_ETAT.REFUSE) { return "badge-danger"; }
            if (data?.traitement === BADGE_ETAT.ABANDONNE) { return "badge-warning"; }
            if (data?.traitement === BADGE_ETAT.REJETE) { return "badge-danger"; }
            break;
        }
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
}