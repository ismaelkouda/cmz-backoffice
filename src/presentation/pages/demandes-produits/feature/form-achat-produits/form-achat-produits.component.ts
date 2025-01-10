import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { DemandesProduitsService } from './../../data-access/demandes-produits.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { StateAchatProduitsService } from '../../data-access/achat-produits/state-achat-produits.service';
import { handle } from 'src/shared/functions/api.function';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { SettingService } from 'src/shared/services/setting.service';
import { formDataBuilder } from 'src/shared/constants/formDataBuilder.constant';
import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';
import { DEMANDE_PRODUITS } from '../../../../../shared/routes/routes';
import { ACHAT_PRODUIT } from '../../demandes-produits-routing.module';

type TYPEVIEW = "editer" | "détails" | "ajouter";
const TYPEVIEW_VALUES: TYPEVIEW[] = ["editer", "détails", "ajouter"];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: "app-form-achat-produits",
    templateUrl: "./form-achat-produits.component.html",
    styles: [`
        .container-button-telecharger {
            border: 2px solid #d0d3da;
            border-radius: 5%;
            height: 70%;
        }
        .padding-bottom-lignes {
            padding-bottom: 30px !important;
        }
        :host ::ng-deep p-dropdown.ng-dirty.ng-invalid > .p-dropdown {
            border-color: #ced4da !important;
        }
    `]
})

export class FormAchatProduitsComponent implements OnInit {
    public formMasseLibelle = {
        etape_1: "Etape 1 : Cliquez pour télécharger le fichier modèle",
        etape_2: "Etape 2 : Importez le fichier renseigné",
        etape_3: "Etape 3 : Vérifiez la cohérence et la complétude du fichier importé"
    } as const;
    public currentArrayHeaders = ['MSISDN*'] as const;
    public fileModel = "src/assets/data/Modele-Chargement-Numéros-En-Masse.xlsx";
    public urlParamRef: TYPEVIEW;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public urlParamId: string;

    public filter: Object;
    public module: string;
    public subModule: string;
    public achatSelected: Object|undefined;
    public listAchatProduits: Array<object>;
    public pargination: any;
    public achatForm: FormGroup;
    public displayUrlErrorPage: boolean = false;
    public listUsages: Array<any> = [];
    public listFormules: Array<any> = [];
    public coutUinitaire: number;

    constructor(private activatedRoute: ActivatedRoute, private location: Location, private stateAchatProduitsService: StateAchatProduitsService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService, private demandesProduitsService: DemandesProduitsService,
        private fb: FormBuilder, private settingService: SettingService, private patrimoineService: PatrimoineService,
        private sharedDataService: SharedDataService, private router: Router) { }

    ngOnInit(): void {
        this.GetCoutUnitaireOperation();
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.initAchatProduitsForm();
        this.getParamsInUrl();
        this.getAllUsages();
        this.GetAllFormules();
    }

    public getAllUsages() {
        this.patrimoineService.GetAllUsages({}).subscribe({
            next: (response) => {
                this.listUsages = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public GetAllFormules(): void {
        this.settingService.GetAllFormules({}).subscribe({
            next: (response) => {
                this.listFormules = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamId = params?.["identifiant"];
            this.urlParamRef = params?.["ref"];
            this.urlParamCurrentPage = params?.["urlParamCurrentPage"];
            this.urlParamFilter = this.stateAchatProduitsService.getFilterAchatProduitsState(params?.["filter"]);
        });
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
        } else {
            switch (this.urlParamRef) {
                case "ajouter":

                    break;

                case "détails":
                    this.pageCallback(this.filter, this.urlParamCurrentPage);
                    this.achatForm.disable();
                    break;

                case "editer":
                    this.pageCallback(this.filter, this.urlParamCurrentPage);
                    break;
            }
        }
    }
    public GetCoutUnitaireOperation(): void {
        this.settingService.GetCoutUnitaireOperation(OperationTransaction.SIM_BLANCHE).subscribe({
            next: (response) => {
                this.coutUinitaire = response['data'];
                this.achatForm.get("prix_unitaire")?.patchValue(this.coutUinitaire)
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    async pageCallback(urlParamFilter: Object = {}, urlParamCurrentPage: string = "1") {
        const response: any = await handle(() => this.demandesProduitsService.postCommandeProduitCommandesAll(urlParamFilter, urlParamCurrentPage), this.toastrService, this.loadingBarService);
        if (response.error === false) this.handleSuccessfulPageCallback(response, urlParamFilter);
    }

    private handleSuccessfulPageCallback(response: Object, urlParamFilter: Object): void {
        this.listAchatProduits = response?.["data"].data;
        this.stateAchatProduitsService.setCurrentPageAchatProduitsState(this.urlParamCurrentPage);
        this.stateAchatProduitsService.setFilterAchatProduitsState(urlParamFilter);
        this.getAchatSelected(this.listAchatProduits)
    }

    private getAchatSelected(listAchatProduits: Array<Object>): void {
        this.achatSelected = listAchatProduits.find((achat) => achat?.["numero_commande"] == this.urlParamId);
        if (this.achatSelected) {
            this.patchValueAchatProduitsForm(this.achatSelected);
        } else {
            this.displayUrlErrorPage = true;
        }
    }

    private initAchatProduitsForm(): void {
        this.achatForm = this.fb.group({
            operation: OperationTransaction.SIM_BLANCHE_EN_MASSE,
            nb_demandes: this.createFormControl(this.achatSelected?.["nb_demandes"], Validators.required, false),
            prix_unitaire: this.createFormControl(this.achatSelected?.["prix_unitaire"], Validators.required, true),
            description: this.createFormControl(this.achatSelected?.["description"], Validators.required, false),
            montant: this.createFormControl(this.achatSelected?.["montant"], Validators.required, true),
            justificatif: this.createFormControl(null, Validators.required, false),
        });

        const nbDemandesControl = this.achatForm.get("nb_demandes");
        const prixUnitaireControl = this.achatForm.get("prix_unitaire");
        prixUnitaireControl?.disable();
        const montantControl = this.achatForm.get("montant");
        montantControl?.disable();
        const gererMontantDemandes = (value: number) => {
            if (nbDemandesControl?.valid) {
                const montantDemandes = value * prixUnitaireControl?.value;
                montantControl?.setValue(montantDemandes)
            } else {
                montantControl?.setValue(0)
            }
            montantControl?.updateValueAndValidity();
        };
        gererMontantDemandes(nbDemandesControl?.value);
        nbDemandesControl?.valueChanges.subscribe((value) => {
            gererMontantDemandes(value);
        });
    }


    
    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.achatForm.get("justificatif")?.patchValue(selectedFile);

    }

    private createFormControl(initialValue: any, validator: any = null, isDisabled: boolean = false): any {
        return [{ value: initialValue, disabled: isDisabled }, validator].filter(v => v !== null);
    }

    private patchValueAchatProduitsForm(numeroSelected: Object): void {
        this.achatForm.patchValue({
            sims_file: numeroSelected?.["sims_file"],
            description: numeroSelected?.["description"],
        })
    }

    public pushCurrentArrayForm(file_upload: any) {
        if (file_upload) this.achatForm.get("sims_file")?.patchValue(file_upload.sims_file);
    }

    async onSubmitAchatProduitsForm(): Promise<void> {
        switch (this.urlParamRef) {
            case "ajouter":
                if (this.achatForm.valid) {
                    const response: any = await handle(() => this.demandesProduitsService.postCommandeProduitCommandesStore(FormatFormData(this.achatForm.value)), this.toastrService, this.loadingBarService);
                    if (response?.error === false) this.handleSuccessfulAchatProduitsForm(response);
                }
                break;

            case "editer":
                if (this.achatForm.valid) {
                    // const response: any = await handle(() => this.patrimoineService.OnChangeStatut(FormatFormData(this.achatForm.value)), this.toastrService, this.loadingBarService);
                    // if (response?.error === false) this.handleSuccessfulAchatProduitsForm(response);
                }
                break;
        }
    }

    private handleSuccessfulAchatProduitsForm(response): void {
        this.toastrService.success(response?.message);
        this.sharedDataService.sendDemandesProduitsAchatProduits()
        this.closeInterface();
    }

    public closeInterface(): void {
        this.router.navigate([DEMANDE_PRODUITS + "/" + ACHAT_PRODUIT]);
    }

    public onGoToBack(): void {
        this.location.back();
    }
}