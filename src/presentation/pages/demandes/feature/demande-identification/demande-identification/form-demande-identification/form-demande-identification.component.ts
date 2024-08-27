import { Component } from '@angular/core';
import { DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { DEMANDE_IDENTIFICATION } from '../../../../demandes-routing.module';
import { handle } from 'src/shared/functions/api.function';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { DemandeIntegrationStateService } from '../../../../data-access/demande-integration/demande-integration-state.service';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { ListCommuneService } from 'src/shared/services/list-commune.service';
import { FormatFormData } from 'src/shared/functions/formatFormData.function';


type TYPEVIEW = "editer" | "détails" | "ajouter";
interface TYPEPARAMSINURL { view: TYPEVIEW, page: number, id: number, filter: Object };
@Component({
  selector: 'app-form-demande-identification',
  templateUrl: './form-demande-identification.component.html',
})
export class FormDemandeIdentificationComponent {
  public paramsInUrl: TYPEPARAMSINURL;
    public view: string;
    public page: number;
    public id: number; 
    public filter: Object;
    public formMasseLibelle = {
        etape_1: "Etape 1 : Cliquez pour télécharger le fichier modèle puis remplissez tous les champs obligatoires",
        etape_2: "Etape 2 : Importez le fichier téléchargé complété avec les infos d'identifications de chaque SIM",
        etape_3: "Etape 3 : Vérifiez la cohérence et la complétude du fichier importé"
    } as const;
    public libelleFile = {
        file1: "Télécharger le modèle",
        file2:"Charger le fichier"
    } as const;
    public currentArrayHeaders = [ 'MSISDN', 'IMSI', 'NOM EMPLACEMENT', 'ADRESSE EMAIL', 'ADRESSE GEO', 'LONGITUDE', 'LATITUDE'] as const;
    public fileModel = "src/assets/data/Modele-Identification-SIM-Identification-En-Masse.xlsx";
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
    public demandeIdentificationForm: FormGroup;

    constructor(private router: Router, private fb: FormBuilder,
        public mappingService: MappingService, private listCommuneService: ListCommuneService,
        public settingService: SettingService, private patrimoineService: PatrimoineService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private activatedRoute: ActivatedRoute, private supervisionOperationService: SupervisionOperationService,
        private demandeIntegrationStateService: DemandeIntegrationStateService,) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    }

    ngOnInit(): void {
        this.initPage();
        this.initDmandeIdentificationForm();
        this.GetAllFirstLevel();
        this.GetAllThirdLevel();
        this.GetAllUsages();
        this.GetAllFormules();
        console.log('this.demandeIntegrationStateService.getParginateState()', this.demandeIntegrationStateService.getParginateState())
        // Recuperation des paramètres situer dans l'url
        this.getParamsInUrl();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            console.log('params', params?.["view"])
            this.view = params?.["view"];
            console.log('this.view', this.view)
            this.page = params?.["page"];
            this.id = params?.["id"];
            this.filter = this.demandeIntegrationStateService.parseQueryStringToObject(params?.["filter"]);
        });
        switch (this.paramsInUrl?.view) {
            case "ajouter":

                break;

            case "détails":
                // const numero_current_page = this.demandeIntegrationStateService.getParginateState().currentPage;
                // const data_filter = this.demandeIntegrationStateService.getFilterState();
                // const data_selected = this.demandeIntegrationStateService.setTableItemSelectedState(data.data);
                break;

            case "editer":

                break;
        }
        console.log('this.paramsInUrl', this.paramsInUrl)
    }

    async pageCallback(dataToSend: Object = {}, nbrPage: number = 1) {
        this.response = await handle(() => this.supervisionOperationService.GetAllTransactions(dataToSend, nbrPage), this.toastrService, this.loadingBarService);
        this.handleSuccessfulPageCallback(this.response);
    }

    private handleSuccessfulPageCallback(response: any): void {}

    private initDmandeIdentificationForm(): void {
        const filterState = this.demandeIntegrationStateService.getFilterState();
        this.demandeIdentificationForm = this.fb.group({
            niveau_un_uuid: this.createFormControl(filterState?.niveau_un_uuid, Validators.required, false),
            niveau_deux_uuid: this.createFormControl(filterState?.niveau_deux_uuid, Validators.required, false),
            niveau_trois_uuid: this.createFormControl(filterState?.niveau_trois_uuid, Validators.required, false),
            usage_id: this.createFormControl(filterState?.usage_id, Validators.required, false),
            formule_uuid: this.createFormControl(filterState?.formule_uuid, Validators.required, false),
            operation: this.createFormControl('identification-en-masse', null, false),
            file: this.createFormControl(filterState?.file, false),
            description: this.createFormControl(filterState?.description, Validators.required, false),
            sims_file: this.createFormControl(filterState?.sims_file, Validators.required, false),
        });
    }

    private createFormControl(initialValue: any, validator: any = null, isDisabled: boolean = false): any {
        return [{ value: initialValue, disabled: isDisabled }, validator].filter(v => v !== null);
    }

    async onSubmitDmandeIntegrationForm(): Promise<void> {
        console.log("into in function");
        console.log(this.demandeIdentificationForm.value)
        if (this.demandeIdentificationForm.valid) {
            console.log("in function", this.demandeIdentificationForm.value);
            const response: any = await handle(() => this.patrimoineService.OnChangeStatutIdentification(FormatFormData(this.demandeIdentificationForm.value)), this.toastrService, this.loadingBarService);
            if (response?.error === false) this.handleSuccessfulDmandeIntegrationForm(this.response);
        }
    }

    async GetAllFirstLevel() {
        this.response = await handle(() => this.settingService.GetAllFirstLevelSimple({}), this.toastrService, this.loadingBarService);
        if (this.response?.data) this.handleSuccessfulFirstLevel(this.response);
    }

    async GetAllThirdLevel() {
        this.response = await handle(() => this.settingService.GetAllThirdSimple({}), this.toastrService, this.loadingBarService);
        if (this.response?.data) this.handleSuccessfulThirdLevel(this.response);
    }

    async GetAllUsages() {
        this.response = await handle(() => this.patrimoineService.GetAllUsages({}), this.toastrService, this.loadingBarService);
        if (this.response?.data) this.handleSuccessfulUsages(this.response);
    }

    async GetAllFormules() {
        this.response = await handle(() => this.settingService.GetAllFormules({}), this.toastrService, this.loadingBarService);
        if (this.response?.data) this.handleSuccessfulFormules(this.response);
    }

    private handleSuccessfulDmandeIntegrationForm(response): void {
        this.toastrService.success(response?.message);
        this.closeInterface();
    }

    private handleSuccessfulFirstLevel(response): void {
        this.listFirstLeveDatas = response['data'].map((element) => { return { ...element, fullName: `${element.nom}` } });
    }

    private handleSuccessfulThirdLevel(response): void {
        this.listThirdLevelDatas = response['data'].map((element) => { return { ...element, fullName: `${element.nom}` } });
    }

    private handleSuccessfulUsages(response): void {
        this.listUsages = response['data'];
    }

    private handleSuccessfulFormules(response): void {
        this.listFormules = response['data'];
    }

    public onChangeFirstLvel(uuid: any) {
        this.listSecondLevelDatas = [];
        this.listFirstLeveDatas.find((element) => {
            if (element.uuid === uuid) this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
        });
    }

    public onChangeFile(file: any) {
        if (file) this.demandeIdentificationForm.patchValue({ file: file });
    }

    public pushCurrentArrayForm(file_upload: any) {
        if (file_upload) this.demandeIdentificationForm.patchValue({ sims_file: file_upload.sims_file });
    }

    async onDownloadModel(event: any): Promise<any> {
        // const tokenUser = JSON.parse(this.storage.getData('user')).token;
        // window.location.href = this.supervisionOperationService.GetGestionTransactionsDemandesServicesDownloadAbonnementsData(this.listDemandes.numero_demande, tokenUser);
    }

    public closeInterface(): void {
        this.router.navigate([DEMANDE_SERVICE + "/" + DEMANDE_IDENTIFICATION]);
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
