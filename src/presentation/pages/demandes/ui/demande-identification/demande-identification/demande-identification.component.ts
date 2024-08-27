import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { Pargination } from 'src/shared/table/pargination';
import { handle } from 'src/shared/functions/api.function';
import { SEARCH } from 'src/shared/routes/routes';
import { DEMANDE_IDENTIFICATION_DOSSIER, DEMANDE_IDENTIFICATION_FORM } from '../../../demandes-routing.module';
type TYPEVIEW = "editer" | "détails" | "ajouter" | "dossier";



@Component({
    selector: 'app-demande-identification',
    templateUrl: './demande-identification.component.html',
    styleUrls: ['./demande-identification.component.scss']
})
export class DemandeIdentificationComponent {

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
    public dataToSend: Object;

    constructor(private activatedRoute: ActivatedRoute, private supervisionOperationService: SupervisionOperationService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private router: Router, public mappingService: MappingService,
        private excelService: ExcelService,) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    }

    ngOnInit(): void {
        this.initPage();
        this.pageCallback();
    }

    async pageCallback(dataToSend: Object = {}, nbrPage: number = 1) {
        this.dataToSend = { ...dataToSend, ...{ operation: OperationTransaction.IDENTIFICATION } }
        this.response = await handle(() => this.supervisionOperationService.GetAllDemandeIdentification(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        this.handleSuccessfulPageCallback(this.response);
    }

    private handleSuccessfulPageCallback(response): void {
        this.listDemandesIntegrations = response.data.data;
        this.spinner = false;
        this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
    }

    public onPageChange(event: number) {
        this.pageCallback(this.dataToSend, event + 1);
    }

    public navigateByUrl(data: { data: null | Object, paramUrl: TYPEVIEW }): void {
        if (data.paramUrl === "ajouter") {
            this.router.navigate([DEMANDE_IDENTIFICATION_FORM + "/" + SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl } });
        } else if (data.paramUrl === "editer" || data.paramUrl === "détails") {
            this.router.navigate([DEMANDE_IDENTIFICATION_FORM + "/" + SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage, filter: this.dataToSend, id: data.data["id"] } });
        } else if (data.paramUrl === "dossier") {
            this.router.navigate([DEMANDE_IDENTIFICATION_DOSSIER + "/" + SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, page: this.pargination?.currentPage, filter: this.dataToSend, id: data.data["id"], numero_demande: data.data["numero_demande"], tenant_code: this.mappingService.tenant.tenant_code, statut: data.data["statut"] } });
        }
    }

    private initPage(): void {

        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
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

    ngOnDestroy(): void {
        if (this.subscriptionListDemandesIntegrations) this.subscriptionListDemandesIntegrations.unsubscribe();
    }
}
