import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pargination } from 'src/shared/table/pargination';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { DemandeIntegrationStateService } from '../../../../data-access/demande-integration/demande-integration-state.service';
import { DemandeService } from '../../../../data-access/demande.service';
import { handle } from 'src/shared/functions/api.function';
import { DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { DEMANDE_IDENTIFICATION, DEMANDE_INTEGRATION } from '../../../../demandes-routing.module';

type TYPEVIEW = "dossier" ;

@Component({
  selector: 'app-management-demande-identification',
  templateUrl: './management-demande-identification.component.html',
  styleUrls: ['./management-demande-identification.component.scss']
})
export class ManagementDemandeIdentificationComponent implements OnInit  {

    public view: TYPEVIEW;
    public page: number;
    public id: number;
    public filter: Object;
    public numero_demande: string;
    public tenant_code: string;
    public statut: string;

    public module: string;
    public subModule: string;
    
    public listLignesIdentification: Array<Object>;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public spinner: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, public patrimoineService: PatrimoineService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private demandeIntegrationStateService: DemandeIntegrationStateService,
        public demandeService: DemandeService, private router: Router) {}

    ngOnInit(): void {
        this.initPage();
        this.getParamsInUrl();
        this.pageCallback();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.view = params?.["view"];
            this.page = params?.["page"];
            this.id = params?.["id"];
            this.numero_demande = params?.["numero_demande"];
            this.tenant_code  = params?.["tenant_code"];
            this.statut = params?.["statut"];
            this.filter = this.demandeIntegrationStateService.parseQueryStringToObject(params?.["filter"]);
        });
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

    async pageCallback(dataToSend: Object = {operation: "identification", tenant_code: this.tenant_code, numero_demande: this.numero_demande}, nbrPage: number = 1) {
        const response: any = await handle(() => this.patrimoineService.GetAllTransactions(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        if(response?.error === false) this.handleSuccessfulPageCallback(response);
    }
    private handleSuccessfulPageCallback(response: any): void {
        this.listLignesIdentification = response?.data?.data;
        this.spinner = false;
        this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
    }
    public exportExcel(): void {
        // const data = this.listDemandesIntegrations.map((item: any) => ({
        //     'Date demande': item?.created_at,
        //     'N° demande': item?.numero_demande,
        //     '# Lignes': item?.nb_demande_soumises,
        //     '# Traitées': item?.nb_demande_traitees,
        //     'Statut': item?.statut,
        //     'Demandeur': `${item?.demandeur_nom} ${item?.demandeur_prenoms}`
        // }));
        // this.excelService.exportAsExcelFile(data, `Liste des demandes [${this.selectedOperation}]`);
    }

    public closeView(): void {
        this.router.navigateByUrl(`${DEMANDE_SERVICE}/${DEMANDE_IDENTIFICATION}`)
    }


}
