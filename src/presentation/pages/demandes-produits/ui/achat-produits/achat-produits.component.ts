import { handle } from 'src/shared/functions/api.function';
import { TYPE_PRODUITS } from './../../../../../shared/enum/type-produits.enum';
import { BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { SharedDataService } from './../../../../../shared/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pargination } from './../../../../../shared/class/pargination';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DemandesProduitsService } from '../../data-access/demandes-produits.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { StateAchatProduitsService } from '../../data-access/achat-produits/state-achat-produits.service';
import { DETAILS, FACTURE, FORM } from '../../demandes-produits-routing.module';
import { BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { DemandeService } from '../../../demandes/data-access/demande.service';

type PageAction =
    | { data: Object; action: 'ajouter'; view: 'page' }
    | { data: Object; action: 'détails'; view: 'page' }
    | { data: Object; action: 'invoice'; view: 'page' };

const etape_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const etat_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];

@Component({
    selector: 'app-achat-produits',
    templateUrl: './achat-produits.component.html',
})
export class AchatProduitsComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public listAchatProduits: Array<Object> = [];
    public spinner: boolean = false;
    public selectedAchat: Object | null;
    public listTypeProduits: Array<string> = [];
    public filterData: Object;
    public currentPage: string;
    public listEtapeDossier: Array<string> = etape_values;
    public listEtatDossier: Array<string> = etat_values;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private sharedDataService: SharedDataService,
        public demandeService: DemandeService,
        private demandesProduitsService: DemandesProduitsService,
        private stateAchatProduitsService: StateAchatProduitsService,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService
    ) {
        Object.values(TYPE_PRODUITS).forEach((item) => {
            this.listTypeProduits.push(item);
        });
    }

    ngOnInit(): void {
        this.sharedDataService
            .postDemandesProduitsAchatProduits()
            .subscribe(() => {
                this.pageCallback();
            });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.filterData =
            this.stateAchatProduitsService.getFilterAchatProduitsState();
        this.currentPage =
            this.stateAchatProduitsService.getCurrentPageAchatProduitsState();
        this.selectedAchat =
            this.stateAchatProduitsService.getItemSelectedState();
        this.pageCallback(this.filterData, this.currentPage);
        this.spinner = true;
    }

    async pageCallback(
        dataToSend: Object = {},
        nbrPage: string = '1'
    ): Promise<any> {
        const response: any = await handle(
            () =>
                this.demandeService.GetDemandeServiceByTransaction(
                    { ...dataToSend, operation: 'sim-blanche' },
                    nbrPage
                ),
            this.toastrService,
            this.loadingBarService
        );
        if (response.error === false)
            this.handleSuccessfulPageCallback(response);
    }
    private handleSuccessfulPageCallback(response: any): void {
        this.listAchatProduits = response?.data?.data;
        this.pargination = new Pargination(
            response?.data?.p,
            response?.data?.to,
            response?.data?.last_page,
            response?.data?.total,
            response?.data?.per_page,
            response?.data?.current_page,
            (response?.data?.current_page - 1) * response.data?.per_page + 1
        );
        this.spinner = false;
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.pageCallback(filterData);
    }

    public onPageChange(event: number) {
        this.pageCallback(this.filterData, JSON.stringify(event + 1));
    }

    public OnExportExcel(): void {
        // const data = this.listAchatProduits.map((numero: Object) => ({
        //     "Date de création": numero?.["created_at"],
        //     "Réference": numero?.["reference"],
        //     "# Total": numero?.["nb_achat-produits_total"],
        //     "# utilisées": numero?.["nb_achat-produits_utilises"],
        //     "# restantes": numero?.["nb_achat-produits_total"] || 0 - numero?.["nb_achat-produits_utilises"] || 0,
        //     "Statut": numero?.["statut"],
        // }));
        // this.excelService.exportAsExcelFile(data, "Liste_des_numéros");
    }

    public navigateByUrl(params: PageAction): void {
        const id = params.data ? params.data['numero_demande'] : null;
        const ref = params.action;
        const operation = params.data?.['operation'];
        const current_page = this.pargination?.['current_page'] || 1;
        const filter =
            this.stateAchatProduitsService?.setFilterAchatProduitsState(
                this.filterData
            ) ?? null;

        const queryParams = {
            ref,
            current_page,
            filter,
            operation,
        };

        let routePath: string;

        switch (params.action) {
            case 'détails':
                routePath = DETAILS + `/${id}`;
                break;

            case 'ajouter':
                routePath = FORM;
                break;

            case 'invoice':
                routePath = FACTURE + `/${id}`;
                break;
        }

        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    ngOnDestroy(): void {
        this.stateAchatProduitsService.clearAchatProduits();
    }
}
