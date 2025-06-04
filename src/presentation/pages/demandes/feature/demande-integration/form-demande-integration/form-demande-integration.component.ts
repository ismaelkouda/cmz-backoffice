import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEMANDE_INTEGRATION } from '../../../demandes-routing.module';
import { DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MappingService } from 'src/shared/services/mapping.service';
// import { ListCommuneService } from "src/shared/services/list-commune.service";
import { handle } from 'src/shared/functions/api.function';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { DemandeIntegrationStateService } from '../../../data-access/demande-integration/demande-integration-state.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { SharedDataService } from 'src/shared/services/shared-data.service';

type TYPEVIEW = 'editer' | 'détails' | 'ajouter';

@Component({
    selector: 'app-form-demande-integration',
    templateUrl: './form-demande-integration.component.html',
    styleUrls: ['./form-demande-integration.component.scss'],
})
export class FormDemandeIntegrationComponent implements OnInit {
    public INTEGRATION_EN_MASSE: string =
        OperationTransaction.INTEGRATION_EN_MASSE;
    public view: TYPEVIEW;
    public page: number;
    public id: number;
    public filter: Object;
    public formMasseLibelle = {
        etape_1:
            'Etape 1 : Cliquez pour télécharger le fichier modèle puis remplissez tous les champs obligatoires',
        etape_2:
            'Etape 2 : Cliquez pour importez le fichier de SIM que vous avez téléchargé et renseigné',
        etape_3:
            'Etape 3 : Vérifiez la cohérence et la complétude du fichier importé',
    } as const;
    public currentArrayHeaders = [
        'MSISDN*',
        'IMSI',
        'ICCID',
        'NOM EMPLACEMENT*',
        'ADRESSE EMAIL',
        'ADRESSE GEO',
        'LONGITUDE',
        'LATITUDE',
    ] as const;
    public fileModel =
        'src/assets/data/Modele-Traitement-Activation-En-Masse.xlsx';
    private response: any;
    public module: string;
    public subModule: string;
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;
    public listFirstLeveDatas: Array<any> = [];
    public listSecondLevelDatas: Array<any> = [];
    public listThirdLevelDatas: Array<any> = [];
    public listFormules: Array<any> = [];
    public listUsages: Array<any> = [];
    public demandeIntegrationForm: FormGroup;
    private listDemandesIntegrations: Array<Object>;
    public demandesIntegrationSelected: Object;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        public mappingService: MappingService,
        public settingService: SettingService,
        private patrimoineService: PatrimoineService,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        private activatedRoute: ActivatedRoute,
        private supervisionOperationService: SupervisionOperationService,
        private demandeIntegrationStateService: DemandeIntegrationStateService,
        private storage: EncodingDataService,
        private sharedDataService: SharedDataService
    ) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle =
            this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    }

    ngOnInit(): void {
        this.initPage();
        this.initDmandeIntegrationForm();
        this.GetAllFirstLevel();
        this.GetAllThirdLevel();
        this.GetAllUsages();
        this.GetAllFormules();
        // Recuperation des paramètres situer dans l'url
        this.getParamsInUrl();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.view = params?.['view'];
            this.page = params?.['page'];
            this.id = params?.['id'];
            this.filter =
                this.demandeIntegrationStateService.parseQueryStringToObject(
                    params?.['filter']
                );
        });
        switch (this.view) {
            case 'ajouter':
                break;

            case 'détails':
                this.pageCallback(this.filter, this.page);
                this.demandeIntegrationForm.disable();
                break;

            case 'editer':
                this.pageCallback(this.filter, this.page);
                break;
        }
    }

    async pageCallback(dataToSend: Object = {}, nbrPage: number = 1) {
        this.response = await handle(
            () =>
                this.supervisionOperationService.GetAllTransactions(
                    dataToSend,
                    nbrPage
                ),
            this.toastrService,
            this.loadingBarService
        );
        this.handleSuccessfulPageCallback(this.response);
    }

    private handleSuccessfulPageCallback(response: any): void {
        this.listDemandesIntegrations = response.data.data;
        this.getDemandeIntegrationSelected(this.listDemandesIntegrations);
    }

    private getDemandeIntegrationSelected(
        listDemandesIntegrations: Array<Object>
    ): void {
        // this.demandesIntegrationSelected = listDemandesIntegrations.find((demandeIntegration) => demandeIntegration?.["id"] == this.id);
        this.patchValueDmandeIntegrationForm(this.demandesIntegrationSelected);
    }

    private initDmandeIntegrationForm(): void {
        this.demandeIntegrationForm = this.fb.group({
            niveau_un_uuid: this.createFormControl(
                this.demandesIntegrationSelected?.['niveau_un_uuid'],
                Validators.required,
                false
            ),
            niveau_deux_uuid: this.createFormControl(
                this.demandesIntegrationSelected?.['niveau_deux_uuid'],
                Validators.required,
                false
            ),
            niveau_trois_uuid: this.createFormControl(
                this.demandesIntegrationSelected?.['niveau_trois_uuid'],
                Validators.required,
                false
            ),
            usage_id: this.createFormControl(
                this.demandesIntegrationSelected?.['usage_id'],
                Validators.required,
                false
            ),
            formule_uuid: this.createFormControl(
                this.demandesIntegrationSelected?.['formule_uuid'],
                Validators.required,
                false
            ),
            operation: this.createFormControl(
                this.INTEGRATION_EN_MASSE,
                null,
                false
            ),
            montant_formule: this.createFormControl(
                this.demandesIntegrationSelected?.['montant_formule'],
                Validators.required,
                false
            ),
            recu_paiement: this.createFormControl(
                this.demandesIntegrationSelected?.['recu_paiement'],
                Validators.required,
                false
            ),
            description: this.createFormControl(
                this.demandesIntegrationSelected?.['description'],
                Validators.required,
                false
            ),
            sims_file: this.createFormControl(
                this.demandesIntegrationSelected?.['sims_file'],
                Validators.required,
                false
            ),
        });
    }

    private createFormControl(
        initialValue: any,
        validator: any = null,
        isDisabled: boolean = false
    ): any {
        return [
            { value: initialValue, disabled: isDisabled },
            validator,
        ].filter((v) => v !== null);
    }

    private patchValueDmandeIntegrationForm(
        demandesIntegrationSelected: Object
    ): void {
        this.demandeIntegrationForm.patchValue({
            niveau_un_uuid:
                this.view === 'editer'
                    ? demandesIntegrationSelected?.['niveau_un_uuid']
                    : demandesIntegrationSelected?.['niveau_un'],
            niveau_deux_uuid:
                this.view === 'editer'
                    ? demandesIntegrationSelected?.['niveau_deux_uuid']
                    : demandesIntegrationSelected?.['niveau_deux'],
            niveau_trois_uuid:
                this.view === 'editer'
                    ? demandesIntegrationSelected?.['niveau_trois_uuid']
                    : demandesIntegrationSelected?.['niveau_trois'],
            usage_id:
                this.view === 'editer'
                    ? demandesIntegrationSelected?.['usage_id']
                    : demandesIntegrationSelected?.['usage_id'],
            formule_uuid:
                this.view === 'editer'
                    ? demandesIntegrationSelected?.['formule_uuid']
                    : demandesIntegrationSelected?.['formule'],
            operation: 'integration',
            montant_formule:
                this.demandesIntegrationSelected?.['montant_formule'],
            recu_paiement: this.demandesIntegrationSelected?.['recu_paiement'],
            description: this.demandesIntegrationSelected?.['description'],
            sims_file: this.demandesIntegrationSelected?.['sims_file'],
        });
        this.onChangeFirstLvel(
            this.demandesIntegrationSelected?.['niveau_un_uuid']
        );
    }

    public onChangeFile(file: FileList) {
        if (file)
            this.demandeIntegrationForm
                .get('recu_paiement')
                .patchValue(file.item(0));
    }

    public pushCurrentArrayForm(file_upload: any) {
        if (file_upload)
            this.demandeIntegrationForm
                .get('sims_file')
                .patchValue(file_upload.sims_file);
    }

    async onSubmitDmandeIntegrationForm(): Promise<void> {
        switch (this.view) {
            case 'ajouter':
                if (this.demandeIntegrationForm.valid) {
                    const response: any = await handle(
                        () =>
                            this.patrimoineService.OnChangeStatut(
                                FormatFormData(
                                    this.demandeIntegrationForm.value
                                )
                            ),
                        this.toastrService,
                        this.loadingBarService
                    );
                    if (response?.error === false)
                        this.handleSuccessfulDmandeIntegrationForm(response);
                }
                break;

            case 'editer':
                if (this.demandeIntegrationForm.valid) {
                    // const response: any = await handle(() => this.patrimoineService.OnChangeStatut(FormatFormData(this.demandeIntegrationForm.value)), this.toastrService, this.loadingBarService);
                    // if (response?.error === false) this.handleSuccessfulDmandeIntegrationForm(response);
                }
                break;
        }
    }

    async GetAllFirstLevel() {
        this.response = await handle(
            () => this.settingService.GetAllFirstLevelSimple({}),
            this.toastrService,
            this.loadingBarService
        );
        if (this.response?.data) this.handleSuccessfulFirstLevel(this.response);
    }

    async GetAllThirdLevel() {
        this.response = await handle(
            () => this.settingService.GetAllThirdSimple({}),
            this.toastrService,
            this.loadingBarService
        );
        if (this.response?.data) this.handleSuccessfulThirdLevel(this.response);
    }

    async GetAllUsages() {
        this.response = await handle(
            () => this.patrimoineService.GetAllUsages({}),
            this.toastrService,
            this.loadingBarService
        );
        if (this.response?.data) this.handleSuccessfulUsages(this.response);
    }

    async GetAllFormules() {
        this.response = await handle(
            () => this.settingService.GetAllFormules({}),
            this.toastrService,
            this.loadingBarService
        );
        if (this.response?.data) this.handleSuccessfulFormules(this.response);
    }

    private handleSuccessfulDmandeIntegrationForm(response): void {
        this.toastrService.success(response?.message);
        this.sharedDataService.sendPatrimoineSimDemandeIntegrationsAll();
        this.closeInterface();
    }

    private handleSuccessfulFirstLevel(response): void {
        this.listFirstLeveDatas = response['data'].map((element) => {
            return { ...element, fullName: `${element.nom}` };
        });
    }

    private handleSuccessfulThirdLevel(response): void {
        this.listThirdLevelDatas = response['data'].map((element) => {
            return { ...element, fullName: `${element.nom}` };
        });
    }

    private handleSuccessfulUsages(response): void {
        this.listUsages = response['data'];
    }

    private handleSuccessfulFormules(response): void {
        this.listFormules = response['data'];
    }

    public onChangeFirstLvel(uuid: any) {
        // this.listSecondLevelDatas = [];
        // this.listFirstLeveDatas.find((element) => {
        //     if (element.uuid === uuid) this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
        // });
    }

    async onDownloadModel(event: any): Promise<any> {
        const tokenUser = JSON.parse(this.storage.getData('user')).token;
        window.location.href =
            this.supervisionOperationService.GetSupervisionOperationsTraitementsSuivisDownloadModeleData(
                this.INTEGRATION_EN_MASSE,
                this.listDemandesIntegrations?.['numero_demande'],
                tokenUser
            );
    }

    async onSeeFile(
        typeFile: 'recuPaimentFile' | 'identificationFile' | 'modelFile'
    ): Promise<void> {
        switch (typeFile) {
            case 'recuPaimentFile':
                break;

            case 'identificationFile':
                break;

            case 'modelFile':
                break;
        }
    }

    public closeInterface(): void {
        this.router.navigate([DEMANDE_SERVICE + '/' + DEMANDE_INTEGRATION]);
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
}
