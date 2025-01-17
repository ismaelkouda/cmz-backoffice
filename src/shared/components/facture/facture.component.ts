import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { StateFactureService } from './data-access/state-facture.service';
import { Pargination } from './../../table/pargination';
import { ExcelService } from './../../services/excel.service';
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../services/shared-data.service';
import { DemandeService } from '../../../presentation/pages/demandes/data-access/demande.service';
import { SettingService } from '../../services/setting.service';
import { MappingService } from '../../services/mapping.service';
import { LOGO_ORANGE } from '../../constants/logoOrange.constant';
import { handle } from '../../functions/api.function';
import { SupervisionOperationService } from '../../../presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { DemandesProduitsService } from '../../../presentation/pages/demandes-produits/data-access/demandes-produits.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../constants/swalWithBootstrapButtonsParams.constant';
import { BADGE_ETAT } from '../../constants/badge-etat.contant';
const Swal = require("sweetalert2");

type TYPEVIEW = "facture";
const TYPEVIEW_VALUES: TYPEVIEW[] = ["facture"];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
type PageAction = { 'data': Object, 'action': 'facture', 'view': 'page' };

@Component({
    selector: "app-facture",
    templateUrl: "./facture.component.html",
    styleUrls: [`./facture.component.scss`]
})

export class FactureComponent {
    public spinner: boolean = true;
    public module: string;
    public subModule: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public urlParamRef: TYPEVIEW;
    public urlParamId: string | null;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public urlParamOperation: string;
    public filterData: Object;

    public listFacture: Array<object>;
    public demandeSelected: Object | undefined;
    public detailsFacture: Object;
    public displayUrlErrorPage: boolean = false;
    public facture: any;
    public isLoadingTitle: boolean = true;
    public logoTenant: string;
    public appName: string;
    public tenant: any;
    public BADGE_ETAT = BADGE_ETAT;
    public formTypePaiement: FormGroup;

    constructor(private activatedRoute: ActivatedRoute, private location: Location, private fb: FormBuilder,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        public demandeService: DemandeService, private stateFactureService: StateFactureService,
        private excelService: ExcelService, private sharedDataService: SharedDataService,
        private settingService: SettingService, private mappingService: MappingService,
        private supervisionOperationService: SupervisionOperationService, private demandesProduitsService: DemandesProduitsService) {
        this.logoTenant = LOGO_ORANGE;
        this.tenant = this.mappingService.tenant
        this.appName = this.mappingService.appName;
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.getParamsInUrl();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.["ref"];
            this.urlParamCurrentPage = params?.["urlParamCurrentPage"];
            this.urlParamOperation = params?.["operation"];
            this.urlParamFilter = this.stateFactureService.getFilterFactureState(params?.["filter"]);
        });
        this.urlParamId = this.activatedRoute.snapshot.paramMap.get('id');
        // si la ref dans l'url est different de  "facture" alors affiche la page d'error
        if (!isTypeView(this.urlParamRef) || !this.urlParamId) {
            this.displayUrlErrorPage = true;
        } else {
            if (this.urlParamId && this.urlParamOperation === "SIM blanche") {
                this.pageCallbackSimBlanche(this.urlParamFilter, this.urlParamCurrentPage);
            } else {
                this.pageCallbackAbonnement(this.urlParamFilter, this.urlParamCurrentPage);
            }
        }
    }

    async pageCallbackSimBlanche(dataToSend: Object = {}, nbrPage: string = "1"): Promise<any> {
        const response: any = await handle(() => this.demandesProduitsService.postCommandeProduitCommandesAll(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulPageCallback(response);
    }
    async pageCallbackAbonnement(urlParamFilter: Object = {}, urlParamCurrentPage: string = "1") {
        const response: any = await handle(() => this.demandeService.GetDemandeServiceByTransaction(urlParamFilter, urlParamCurrentPage), this.toastrService, this.loadingBarService);
        if (response?.error === false) this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: Object): void {
        this.listFacture = response?.["data"]?.data;
        this.getDemandeSelected(this.listFacture)
    }

    private getDemandeSelected(listFacture: Array<Object>): void {
        if (this.urlParamOperation === "SIM blanche") {
            this.demandeSelected = listFacture.find((facture) => facture?.["numero_demande"] == this.urlParamId);
        } else {
            this.demandeSelected = listFacture.find((facture) => facture?.["id"] == this.urlParamId);
        }
        if (this.demandeSelected) {
            if (this.urlParamId && this.urlParamOperation === "SIM blanche") {
                this.postCommandeProduitCommandesDetails();
            } else {
                this.postDemandesServicesDetailsFacture();
            }
        } else {
            this.displayUrlErrorPage = true;
        }
    }
    async postCommandeProduitCommandesDetails(dataToSend = this.demandeSelected?.["numero_demande"]) {
        const response: any = await handle(() => this.supervisionOperationService.postCommandeProduitCommandesDetails(dataToSend), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulPostGestionStocksDetailsFacture(response);
    }
    async postDemandesServicesDetailsFacture(dataToSend = this.demandeSelected?.["numero_demande"]) {
        const response: any = await handle(() => this.settingService.GetSupervisionOperationsDemandesServicesDetails(dataToSend), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulPostGestionStocksDetailsFacture(response);
    }
    private handleSuccessfulPostGestionStocksDetailsFacture(response: any): void {
        this.detailsFacture = response.data;
        this.spinner = false;
        this.initFormTypePaiement();
        this.stateFactureService.setCurrentPageFactureState(this.urlParamCurrentPage);
        this.stateFactureService.setFilterFactureState(this.urlParamFilter);
        this.stateFactureService.setItemSelectedState(this.demandeSelected);
    }

    public onChangeFile(file: FileList, type: "justificatif" | "recu-paiement") {
        switch (type) {
            case "justificatif":
                this.formTypePaiement.patchValue({ justificatif: file.item(0) });
                break;
            case "recu-paiement":
                this.formTypePaiement.patchValue({ recu_paiement: file.item(0) });
                break;
        }
        this.formTypePaiement.get(type === "justificatif" ? "justificatif" : "recu_paiement")?.updateValueAndValidity();
    }

    public downloadFile(typeFile: 'justificatif' | 'recu-paiement') {
        switch (typeFile) {
            case 'justificatif':
                window.open(this.detailsFacture?.["justificatif"]);
                break;

            case 'recu-paiement':
                window.open(this.detailsFacture?.["recu_paiement"]);
                break;
        }
    }

    public displayBoutonRecuPaiement(): boolean {
        return this.detailsFacture?.["recu_paiement"] ? true : false;
    }

    public initFormTypePaiement(): void {
        this.formTypePaiement = this.fb.group({
            numero_demande: this.createFormControl(this.detailsFacture?.["facture"]?.["numero_demande"], null, false),
            operation: this.createFormControl(this.detailsFacture?.["operation"], null, true),
            type_paiement: this.createFormControl(this.getNonNullValue(this.detailsFacture?.["type_paiement"]), Validators.required, false),
            recu_paiement: this.createFormControl(this.detailsFacture?.["recu_paiement"], null, false),
        });
        const typePaiementControl = this.formTypePaiement.get('type_paiement');
        const recuPaiementControl = this.formTypePaiement.get('recu_paiement');
        const gererValidationCommentaire = (value: string) => {
            if (value === 'immédiat') {
                recuPaiementControl?.setValidators([Validators.required]);
            } else {
                recuPaiementControl?.clearValidators();
            }
            recuPaiementControl?.updateValueAndValidity();
        };
        gererValidationCommentaire(typePaiementControl?.value);
        typePaiementControl?.valueChanges.subscribe((value) => {
            gererValidationCommentaire(value);
        });
        if(this.isApproved()) {
            this.formTypePaiement.disable();
        }
    }

    public isApproved(): boolean {
        return this.detailsFacture?.["facture"]?.etat_facture === BADGE_ETAT.APPROUVE;
    }

    private getNonNullValue(value: any): string {
        return value === 'null' || value === null || value === undefined ? '' : value;
    }

    private createFormControl(initialValue: any, validator: any = null, isDisabled: boolean = false): any {
        return [{ value: initialValue, disabled: isDisabled }, validator].filter(v => v !== null);
    }
    async postTraitementsSuivisPaiementDemandeService(dataToSend = { ...this.formTypePaiement.value }): Promise<void> {
        const htmlMessage = this.formTypePaiement.get("type_paiement")?.value == "immédiat" ?
            `Le recu de paiement sera rattaché à la facture <span style="color: #ff6600;"><strong>${this.detailsFacture?.["facture"]?.["numero_demande"]}</strong></span> !` :
            `Paiement différé !`;
        const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass })
            .fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage
            });
        if (result.isConfirmed) {
            const response: any = await handle(() => this.supervisionOperationService.postGestionFacturePaiementsTransaction(FormatFormData(dataToSend)), this.toastrService, this.loadingBarService);
            if (!response?.error) this.successHandle(response)
        };
    }

    private successHandle(response) {
        this.toastrService.success(response?.message);
        this.onGoToBack();
        this.sharedDataService.sendPatrimoineSimDemandesServicesAll();
        this.sharedDataService.sendPatrimoineSimTraitementsDemandesAll();
        this.sharedDataService.sendPatrimoineSimDemandeIntegrationsAll();
    }

    public getStatutPaiemant(facture): Object {
        switch (facture?.["statut"]) {
            case BADGE_ETAT.EN_ATTENTE: return { style: 'badge-dark', value: facture?.["statut"] };
            case "reportée": return { style: 'badge-warning', value: facture?.["statut"] };
            case "soldée": return { style: 'badge-success', value: facture?.["statut"] };
            case "rejetée": return { style: 'badge-danger', value: facture?.["statut"] };
        }
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.postDemandesServicesDetailsFacture(filterData);
    }


    public formatTitle(title: string) {
        return this.supervisionOperationService.HandleFormatTitle(title);
    }

    public OnExportExcel(): void {
        const data = this.listFacture.map((numero: Object) => ({
            "Date de création": numero?.["created_at"],
            "MSISDN": numero?.["msisdn"],
            "Statut": numero?.["statut"],
        }));
        this.excelService.exportAsExcelFile(data, "Liste_des_details_facture" + this.demandeSelected?.["facture"]);
    }

    public onGoToBack(): void {
        this.location.back();
    }
}