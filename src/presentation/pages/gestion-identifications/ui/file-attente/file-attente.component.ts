import { IStatistiquesBox } from './../../../../../shared/interfaces/statistiquesBox.interface';
import { ExcelService } from 'src/shared/services/excel.service';
import { StateFileAttenteService } from './../../data-access/file-attente/state-file-attente.service';
import { Pargination } from 'src/shared/class/pargination';
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { GestionIdentificationsService } from '../../data-access/gestion-identifications.service';
import { handle } from 'src/shared/functions/api.function';
import { SharedService } from 'src/shared/services/shared.service';

@Component({
    selector: `app-file-attente`,
    templateUrl: `./file-attente.component.html`,
    styles: [`.panels-p-dropdown p-dropdown {height: 100% !important; display: flex; align-items: center;}
                .boxClickable { cursor: pointer;}`]
})

export class FileAttenteComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public listSim: Array<Object> = [];
    public spinner: boolean = false;
    public selectedSim: Object | null;
    public filterData: Object;
    public currentPage: string;
    public statistiquesBox: Array<IStatistiquesBox> = [];
    
    constructor(private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private activatedRoute: ActivatedRoute, private stateFileAttenteService: StateFileAttenteService,
        private gestionIdentificationsService: GestionIdentificationsService, private excelService: ExcelService,
        private sharedService: SharedService, private sharedDataService: SharedDataService) {}

    ngOnInit(): void {
        this.getTchesBoxValues();
        this.sharedDataService.postGestionIdentificationsFileAttente().subscribe(() => {
            this.pageCallback(this.filterData);
        });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        // recuperation de la data du filtre et du numero de la page courrante lorsqu'on a fait un tour dans les details
        this.filterData = this.stateFileAttenteService.getFilterFileAttenteState();
        this.currentPage = this.stateFileAttenteService.getCurrentPageFileAttenteState();
        this.selectedSim = this.stateFileAttenteService.getItemSelectedState();
        this.pageCallback(this.filterData, this.currentPage);
        this.spinner = true;
    }

    // async GetAllTenants(dataToSend = {}, nbrPage: string = "1"): Promise<void> {
    //     const response: any = await handle(() => this.sharedService.PostGestionTenantsPortefeuillesTenantAll(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
    //     this.listTenants = response.data?.data;
    // }

    async pageCallback(dataToSend = {}, nbrPage: string = "1"): Promise<any> {
        const response: any = await handle(() => this.gestionIdentificationsService.PostGestionIdentificationsFileAttentes(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulPageCallback(response);
    }
    private handleSuccessfulPageCallback(response: any): void {
        this.getTchesBoxValues(response?.["data"]);
        this.listSim = response["data"]["data"]["data"];
        this.pargination = new Pargination(response?.data?.data?.p, response?.data?.data?.to, response?.data?.data?.last_page, response?.data?.data?.total, response?.data?.data?.per_page, response?.data?.data?.current_page, (response?.data?.data?.current_page - 1) * this.pargination?.per_page + 1);
        this.spinner = false;
    }
    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.pageCallback(filterData);
    }
    public onPageChange(event: number): void {
        this.pageCallback(this.filterData, JSON.stringify(event + 1))
    }
    public onExportExcel(): void {
        const data = this.listSim.map((item: any) => ({
            "Date Création": item?.created_at,
            "Type Opération": item?.operation,
            "N° Dossier": item?.numero_demande,
            "# Cycles": item?.nb_cycle,
            "# Lignes": item?.nb_demande_soumises,
            "# Etape": item?.statut,
            "# Etat": item?.traitement,
            "# Date Etat": item?.approuve_a ?? '',
            "Demandeur": `${item.demandeur_nom} ${item.demandeur_prenoms}`,
        }));
        this.excelService.exportAsExcelFile(data, "liste_dossiers_a_prendre_charge");
    }

    ngOnDestroy(): void {
        // reinitialiser les données de tout les etats
        this.stateFileAttenteService.clearFileAttente();
    }

    getTchesBoxValues(rapport: Object = {}): void {
        this.statistiquesBox = [
            {
                id: 1,
                cardBgColor: 'rgb(52, 152, 219)',
                legend: '# SIM',
                count: rapport?.["total_identifications"] || '0',
                taux: rapport?.["pourcentage_identifications"]
            },
            {
                id: 2,
                cardBgColor: 'rgb(52, 73, 94)',
                legend: '# Reçus',
                count: rapport?.["total_identifications_reçues"] || '0',
                taux: rapport?.["pourcentage_identifications_reçues"] || '0'
            },
            {
                id: 3,
                cardBgColor: 'rgb(231, 76, 60)',
                legend: '# Rejetés',
                count: rapport?.["total_identifications_rejetes"] || '0',
                taux: rapport?.["pourcentage_identifications_rejetes"] || '0'
            },
            // {
            //     cardBgColor: 'rgb(255, 170, 5)',
            //     legend: '# Finalisés | En-attente',
            //     count: rapport?.["total_finalisation_en_attentes"] || '0',
            //     taux: rapport?.["pourcentage_finalisation_en_attentes"]
            // },
            // {
            //     cardBgColor: 'rgb(155, 89, 182)',
            //     legend: '# Clôturés',
            //     count: rapport?.["total_cloture_acceptes"] || '0',
            //     taux: rapport?.["pourcentage_cloture_acceptes"] || '0'
            // },
        ];
    }

}