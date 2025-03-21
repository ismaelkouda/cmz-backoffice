import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { handle } from "src/shared/functions/api.function";
import { DEMANDE_SERVICE, SEARCH } from "src/shared/routes/routes";
import { ExcelService } from "src/shared/services/excel.service";
import { MappingService } from "src/shared/services/mapping.service";
import { Pargination } from "src/shared/table/pargination";
import { SupervisionOperationService } from "src/presentation/pages/supervision-operations/data-access/supervision-operation.service";
import { DemandeIntegrationStateService } from "../../data-access/demande-integration/demande-integration-state.service";
import { DEMANDE_INTEGRATION, DEMANDE_INTEGRATION_DOSSIER, DEMANDE_INTEGRATION_FORM } from "../../demandes-routing.module";
import { DemandeService } from "../../data-access/demande.service";
import { SharedDataService } from "src/shared/services/shared-data.service";

type TYPEVIEW = "editer" | "détails" | "ajouter" | "dossier";

@Component({
    selector: "app-demande-integration",
    templateUrl: "./demande-integration.component.html"
})

export class DemandeIntegrationComponent implements OnInit {
    private response: any = {};
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public module: string;
    public subModule: string;
    private subscriptionListDemandesIntegrations: Subscription;
    public listDemandesIntegrations: Array<Object>;
    public spinner: boolean = false;
    public dataToSend: string;

    constructor(private activatedRoute: ActivatedRoute, private supervisionOperationService: SupervisionOperationService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private router: Router, public mappingService: MappingService,
        private excelService: ExcelService, private demandeIntegrationStateService: DemandeIntegrationStateService,
        private sharedDataService: SharedDataService,
        private demandeService: DemandeService) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (!event.url.includes(`/${DEMANDE_SERVICE}/${DEMANDE_INTEGRATION}`)) {
                    this.demandeIntegrationStateService.removeAllDemandeIntegrationState();
                }
            }
        });
    }

    ngOnInit(): void {
        this.initPage();
        if (this.demandeIntegrationStateService.getTableItemSelectedState()) {
            this.listDemandesIntegrations = this.demandeIntegrationStateService.getTableState();
            this.pargination = this.demandeIntegrationStateService.getParginateState();
        } else {
            this.subscriptionListDemandesIntegrations = this.sharedDataService.postPatrimoineSimDemandeIntegrationsAll().subscribe(() => {
                this.pageCallback();
            });
            this.pageCallback();
            this.spinner = true;
        }
    }

    async pageCallback(dataToSend: Object = { operation: "integration" }, nbrPage: number = 1) {
        this.demandeIntegrationStateService.setFilterState(dataToSend);
        this.dataToSend = this.demandeIntegrationStateService.generateQueryStringFromObject(dataToSend);
        const response: any = await handle(() => this.demandeService.GetDemandeServiceByTransaction(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        if (response?.error === false) this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: any): void {
        this.listDemandesIntegrations = response?.data?.data;
        this.demandeIntegrationStateService.setTableItemSelectedState(null);
        this.spinner = false;
        this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
        this.demandeIntegrationStateService.setParginateState(this.pargination);
    }

    public onPageChange(event: number) {
        this.pageCallback(this.demandeIntegrationStateService.getFilterState(), event + 1);
    }

    public navigateByUrl(data: { data: null | Object, paramUrl: TYPEVIEW }): void {
        if (data.paramUrl === "ajouter") {
            this.router.navigate([DEMANDE_INTEGRATION_FORM + "/" + SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl } });
        } else if (data.paramUrl === "editer" || data.paramUrl === "détails") {
            this.router.navigate([DEMANDE_INTEGRATION_FORM + "/" + SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage, filter: this.dataToSend, id: data.data["id"] } });
        } else if (data.paramUrl === "dossier") {
            this.router.navigate([DEMANDE_INTEGRATION_DOSSIER + "/" + SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage, filter: this.dataToSend, id: data.data["id"], numero_demande: data.data["numero_demande"], tenant_code: this.mappingService.tenant.tenant_code, statut: data.data["statut"] } });
        }
    }

    private initPage(): void {
        // this.subscriptionRouter = this.router.events.pipe(
        //     filter(event => event instanceof NavigationEnd)
        // ).subscribe((event: NavigationEnd) => {
        //     if (!event.urlAfterRedirects.includes('cartes-sim')) {
        //         this.resetState();
        //     }
        // });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
    }

    private resetState(): void {
        // this.demandeIntegrationStateService.setFilterState(null);
        // this.demandeIntegrationStateService.setParginateState(null);
        // this.demandeIntegrationStateService.setTableItemSelectedState(null);
        // this.demandeIntegrationStateService.setTableState(null);
        // this.subscriptionRouter.unsubscribe();
    }

    public exportExcel(): void {
        // const data = this.listDemandesIntegrations.map((item: any) => ({
        //     'Date demande': item?.created_at,
        //     'N° Dossier': item?.numero_demande,
        //     '# Lignes': item?.nb_demande_soumises,
        //     '# Traitées': item?.nb_demande_traitees,
        //     'Statut': item?.statut,
        //     'Demandeur': `${item?.demandeur_nom} ${item?.demandeur_prenoms}`
        // }));
        // this.excelService.exportAsExcelFile(data, `Liste des demandes [${this.selectedOperation}]`);
    }

    ngOnDestroy(): void {
        if (this.subscriptionListDemandesIntegrations) this.subscriptionListDemandesIntegrations.unsubscribe();
    }
}