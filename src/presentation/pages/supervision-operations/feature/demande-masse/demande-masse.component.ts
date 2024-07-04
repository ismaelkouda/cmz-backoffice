import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SupervisionOperationService } from "src/presentation/pages/supervision-operations/data-access/supervision-operation.service";
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { handle } from 'src/shared/functions/api.function';
import { Justificatif } from 'src/shared/enum/Justificatif.enum';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';

@Component({
    selector: 'app-demande-masse',
    templateUrl: './demande-masse.component.html',
    styleUrls: ['./demande-masse.component.scss']
})

export class DemandeMasseComponent implements OnInit {
    public formTraitementMasse: FormGroup;
    @Input() vue: string;
    @Input() IsLoadData;
    @Input() demande;
    @Output() IsLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    public response: any;
    public listDemandes: any;
    public fileModel = "src/assets/data/Modele-Traitement-Activation-En-Masse.xlsx";
    public currentArrayHeaders = ['MSISDN', 'IMSI', 'ICCID', 'ADRESSE IP', 'APN'] as const;
    public listFormules: Array<any> = [];
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;
    public displayFieldsetIdentification: 'traiter' | 'cloturer';
    public listTypeJustificatif: Array<any> = [];
    public sourceStockOrangeSim: string;
    public selectedStockSim: string;
    public croixRougeCommentaire: boolean;
    public stateTraite: string = StatutTransaction.TARITER;
    public stateSoumis: string = StatutTransaction.SOUMIS;
    public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;

    constructor(private supervisionOperationService: SupervisionOperationService, private toastrService: ToastrService,
        private loadingBarService: LoadingBarService, private activeModal: NgbActiveModal, private mappingService: MappingService,
        private settingService: SettingService, private fb: FormBuilder) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        this.selectedStockSim = "orangeci"
        Object.values(Justificatif).forEach((item) => {
            this.listTypeJustificatif.push(item);
        });
        (this.sourceStockOrangeSim = this.mappingService.sourceStockOrangeSim);
    }

    ngOnInit() {
        console.log('this.demande', this.demande)
        console.log('this.demande?.statut === this.stateTraite', this.demande?.statut === this.stateTraite)
        // this.GetFormules();
        this.GetSupervisionOperationsDemandesServicesDetails();
        this.initFormTraitementMasse();
        this.IsJustificatif();
        this.IsRecuPaiement();
    }

    //

    public initFormTraitementMasse(): void {
        this.formTraitementMasse = this.fb.group({
            operation: this.createFormControl(null, Validators.required, this.isTraiteState()),
            niveau_uns_uuid: this.createFormControl(this.listDemandes?.niveau_uns_nom, null, true),
            niveau_deux_uuid: this.createFormControl(this.listDemandes?.niveau_deux_nom, null, true),
            niveau_trois_uuid: this.createFormControl(this.listDemandes?.niveau_trois_nom, null, true),
            numero_demande: [this.demande?.numero_demande],
            formule_uuid: this.createFormControl(this.listDemandes?.formule, Validators.required, true),
            usage_id: this.createFormControl(this.listDemandes?.usage_nom, null, true),
            description: this.createFormControl(this.listDemandes?.description, null, true),
            accepte: [null],
            commentaire: [''],
            sims_file: [null],
        });

        if (this.isTraiteState()) {
            this.updateFormForTraiteState();
        }

        this.formTraitementMasse.get('operation')?.valueChanges.subscribe(this.handleOperationChange.bind(this));

        this.formTraitementMasse.get('accepte')?.valueChanges.subscribe(this.handleAccepteChange.bind(this));
    }

    private createFormControl(initialValue: any, validator: any = null, isDisabled: boolean = false): any {
        return [{ value: initialValue, disabled: isDisabled }, validator].filter(v => v !== null);
    }

    private isTraiteState(): boolean {
        return this.demande?.statut === this.stateTraite;
    }

    private updateFormForTraiteState(): void {
        const operationControl = this.formTraitementMasse.get('operation');
        operationControl?.patchValue('traiter');
        this.displayFieldsetIdentification = 'traiter';
        this.isRequiredFieldsetTraiter('traiter');
        this.isRequiredFieldsetDemande('traiter');
    }

    private handleOperationChange(value: 'traiter' | 'cloturer'): void {
        console.log('Operation value changed to:', value);
        this.displayFieldsetIdentification = value;
        this.isRequiredFieldsetTraiter(value);
        this.isRequiredFieldsetDemande(value);
    }

    private handleAccepteChange(value: 'oui' | 'non'): void {
        this.isRequiredCommenatire(value);
    }

    //

    private isRequiredFieldsetDemande(value: 'traiter' | 'cloturer') {
        this.isRequiredFieldsetAccepte(value)
    }

    private isRequiredFieldsetTraiter(value: 'traiter' | 'cloturer') {
        if (value === 'traiter') {
            this.formTraitementMasse.get("sims_file").setValidators([Validators.required]);
        } else {
            this.formTraitementMasse.get("sims_file").clearValidators();
            this.formTraitementMasse.get("sims_file").disabled;
        }
        this.formTraitementMasse.get("sims_file").updateValueAndValidity();
    }

    private isRequiredCommenatire(value: 'oui' | 'non') {
        if (value === 'non') {
            this.croixRougeCommentaire = true;
            this.formTraitementMasse.get("commentaire").setValidators([Validators.required]);
        } else {
            this.croixRougeCommentaire = false;
            this.formTraitementMasse.get("commentaire").clearValidators();
            this.formTraitementMasse.get("commentaire").disabled;
        }
        this.formTraitementMasse.get("commentaire").updateValueAndValidity();
    }

    private isRequiredFieldsetAccepte(value: 'traiter' | 'cloturer') {
        if (value === 'cloturer') {
            this.formTraitementMasse.get("accepte").setValidators([Validators.required]);
        } else {
            this.formTraitementMasse.get("accepte").clearValidators();
            this.formTraitementMasse.get("accepte").disabled; 
        }
        this.formTraitementMasse.get("accepte").updateValueAndValidity();
    }

    public getLabelForm() {
        if (this.demande.statut === this.stateSoumis || this.demande.traitement === this.treatmenEntente) {
            return "Modifier";
        }
        return "Enregistrer";
    }

    async GetSupervisionOperationsDemandesServicesDetails(dataToSend = this.demande?.numero_demande): Promise<void> {
        this.response = await handle(() => this.supervisionOperationService.GetSupervisionOperationsDemandesServicesDetails(dataToSend), this.toastrService, this.loadingBarService);
        this.listDemandes = this.response?.data;
        this.initFormTraitementMasse();
        this.IsLoading.emit(false);
    }

    // async GetFormules(dataToSend = {}) {
    //     this.response = await handle(() => this.settingService.GetAllFormules(dataToSend), this.toastrService, this.loadingBarService);
    //     this.listFormules = this.response?.data;
    // }

    async onSaveDemandes(dataToSend: {}): Promise<void> {
        switch (this.formTraitementMasse.value.operation) {
            case 'traiter':
                dataToSend = { sims_file: this.formTraitementMasse.value.sims_file, numero_demande: this.listDemandes?.numero_demande };
                this.response = await handle(() => this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisIdentificationsSims(FormatFormData(dataToSend)), this.toastrService, this.loadingBarService);
                if (this.response?.error) this.successfulOnSaveDemandes(this.response);
                break;

            case 'cloturer':
                dataToSend = { accepte: this.formTraitementMasse.value.accepte, numero_demande: this.listDemandes?.numero_demande, commentaire: this.formTraitementMasse?.value?.commentaire };
                this.response = await handle(() => this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisCloturerDemandeService(FormatFormData(dataToSend)), this.toastrService, this.loadingBarService);
                if (this.response?.error) this.successfulOnSaveDemandes(this.response);
                break;
        }

    }
    private successfulOnSaveDemandes(response) {
        this.toastrService.success(response?.message);
        this.handleCloseModal();
        this.IsLoading.emit(false);
    }

    public handleCloseModal(): void {
        this.activeModal.close();
    }

    public OnGetRapportCodeStyle(code: any): string {
        if (code.includes("100")) {
            return "style100";
        } else if (code.includes("200")) {
            return "style200";
        } else {
            return "styledefault";
        }
    }

    public pushCurrentArrayForm(file_upload) {
        this.formTraitementMasse.get("sims_file").patchValue(file_upload.sims_file)
    }

    public downloadFile() {
        if (!this.listDemandes?.justificatif) {
            this.toastrService.warning("Pas de justificatif pour cette operation");
        } else {
            window.open(this.listDemandes?.justificatif);
        }
    }

    public IsJustificatif(): boolean {
        return this.listDemandes?.justificatif ? true : false;
    }

    public downloadRecuPaiement() {
        if (!this.listDemandes?.recu_paiement) {
            this.toastrService.warning("Pas de recu de paiement pour cette operation");
        } else {
            window.open(this.listDemandes?.recu_paiement);
        }
    }

    public IsRecuPaiement(): boolean {
        return this.listDemandes?.justificatif ? true : false;
    }
}