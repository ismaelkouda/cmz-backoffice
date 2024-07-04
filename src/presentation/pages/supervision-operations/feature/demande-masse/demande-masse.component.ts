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

@Component({
    selector: 'app-demande-masse',
    templateUrl: './demande-masse.component.html',
    styleUrls: ['./demande-masse.component.scss']
})

export class DemandeMasseComponent implements OnInit {
    public formTraitementMasse: FormGroup;
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
        // this.GetFormules();
        this.GetSupervisionOperationsDemandesServicesDetails();
        this.initFormTraitementMasse();
        this.IsJustificatif();
        this.IsRecuPaiement();
    }

    public initFormTraitementMasse(): void {
        this.formTraitementMasse = this.fb.group({
            operation: [, Validators.required],
            niveau_uns_uuid: [{ value: this.listDemandes?.niveau_uns_nom, disabled: true }],
            niveau_deux_uuid: [{ value: this.listDemandes?.niveau_deux_nom, disabled: true }],
            niveau_trois_uuid: [{ value: this.listDemandes?.niveau_trois_nom, disabled: true }],
            numero_demande: [this.demande?.numero_demande],
            formule_uuid: [{ value: this.listDemandes?.formule, disabled: true }, this.listDemandes?.formule_uuid, Validators.required],
            usage_id: [{ value: this.listDemandes?.usage_nom, disabled: true }],
            description: [{ value: this.listDemandes?.description, disabled: true }],
            accepte: [null],
            commentaire: [''],
            sims_file: [null],
        });
        this.formTraitementMasse.get('operation').valueChanges.subscribe((value: 'traiter' | 'cloturer') => {
            this.displayFieldsetIdentification = value;
            this.isRequiredFieldsetTraiter(value);
            this.isRequiredFieldsetDemande(value);
        });
        this.formTraitementMasse.get('accepte').valueChanges.subscribe((value: 'oui' | 'non') => {
            this.isRequiredCommenatire(value);
        });
    }

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

    async onSaveDemandes(dataToSend:{}): Promise<void> {
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