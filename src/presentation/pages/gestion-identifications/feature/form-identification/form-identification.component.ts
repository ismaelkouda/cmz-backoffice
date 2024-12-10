import { NatureDocument } from './../../../../../shared/enum/NatureDocument.enum';
import { NaturePiece } from './../../../../../shared/enum/NaturePiece.enum';
import { GestionIdentificationsService } from './../../data-access/gestion-identifications.service';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from './../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { BADGE_ETAPE } from './../../../../../shared/constants/badge-etape.constant';
import { TypeUtilisateur } from './../../../../../shared/enum/TypeUtilisateur.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
const Swal = require("sweetalert2");
import { ToastrService } from 'ngx-toastr';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { MappingService } from 'src/shared/services/mapping.service';
import { handle } from 'src/shared/functions/api.function';

@Component({
    selector: `app-form-identification`,
    templateUrl: `./form-identification.component.html`,
    styleUrls: [`./form-identification.component.scss`]
})

export class FormIdentificationComponent implements OnInit {

    public loadingPage: boolean = true;
    @Input() typeTraitement: { module: string, identifier: boolean, visualiser: boolean };
    @Input() userRole: string;
    @Input() startedDay: string;
    @Input() simSelected: Object;

    public BADGE_ETAPE = BADGE_ETAPE;
    public BADGE_ETAT = BADGE_ETAT;
    public sim: Object;
    public formIdentification: FormGroup;
    public listeTypeUtilisateur: Array<any> = [];
    public listeNaturePiece: Array<any> = [];
    public listeNatureDocument: Array<any> = [];
    public displayPersonne: boolean = false;
    @Output() visibleForm: EventEmitter<boolean> = new EventEmitter<boolean>();
    public titleForm: string;
    public isRequiredCommentaire: boolean = false;
    
    constructor(private fb: FormBuilder, private toastrService: ToastrService,
        private loadingBarService: LoadingBarService, private sharedDataService: SharedDataService,
        private gestionIdentificationsService: GestionIdentificationsService, private mappingService: MappingService) {
            Object.values(TypeUtilisateur).forEach((item) => {
                this.listeTypeUtilisateur.push(item);
            });
            Object.values(NaturePiece).forEach((item) => {
                this.listeNaturePiece.push(item);
            });
            Object.values(NatureDocument).forEach((item) => {
                this.listeNatureDocument.push(item);
            });
        }

    ngOnInit(): void {
        this.PostSupervisionOperationsDemandesServicesDetails();
    }

    async PostSupervisionOperationsDemandesServicesDetails(dataToSend = { tenant_code: this.simSelected?.["tenant_code"], transaction: this.simSelected?.["transaction"] }): Promise<void> {
        const response: any = await handle(() => this.gestionIdentificationsService.PostGestionIdentificationsDetails(dataToSend), this.toastrService, this.loadingBarService);
        this.sim = response?.["data"];
        this.getTitleForm();
        this.initFormIdentification();
        // this.IsLoading.emit(false);
        this.loadingPage = false;
    }

    public getTitleForm() {
        switch (this.sim?.["operation"]) {
            // case this.TYPE_FORM.ACTIVATION:
            //     this.titleForm = "Abonnement Mobile";
            //     break;

            // case this.TYPE_FORM.INTEGRATION:
            //     this.titleForm = "Integration Mobile";
            //     break;

            default: this.titleForm = this.sim?.["msisdn"];
        }
    }

      public OnGetRapportCodeStyle(data: any): string {
        switch (data?.statut) {

            case BADGE_ETAPE.SOUMISSION:
                if (data?.traitement === BADGE_ETAT.RECU) return "style100";
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE) return "styleOrange";
                break;

            case BADGE_ETAPE.TRAITEMENT:
                if (data?.traitement === BADGE_ETAT.REJETE) return "styledefault";
                if (data?.traitement === BADGE_ETAT.ACCEPTE) return "style200";
                break;
        }
    }
    
    public initFormIdentification(): void {
        this.formIdentification = this.fb.group({
            // tenant_code: [this.sim?.["tenant_code"] ?? ''],
            transaction: [this.sim?.["transaction"] ?? ''],

            type_personne: [{ value: this.sim?.["type_personne"] ?? '', disabled: true }],
            nom: [this.sim?.["nom"] ?? ''],
            prenoms: [this.sim?.["prenoms"] ?? ''],
            nature_piece: [this.sim?.["nature_piece"] ?? ''],
            numero_piece: [this.sim?.["numero_piece"] ?? ''],
            date_naissance: [this.sim?.["date_naissance"] ?? ''],
            lieu_naissance: [this.sim?.["lieu_naissance"] ?? ''],
            imsi: [{ value: this.sim?.["imsi"] ?? '', disabled: true }],
            iccid: [{ value: this.sim?.["iccid"] ?? '', disabled: true }],
            msisdn: [{ value: this.sim?.["msisdn"] ?? '', disabled: true }],
            accepte: [{ value: this.sim?.["accepte"] ?? '', disabled: this.disabledPrendreField() }, Validators.required],
            commentaire: [{ value: this.sim?.["commentaire"], disabled: this.disabledPrendreField() }],
        });
        if(this.typeTraitement.module === 'file-attente') this.formIdentification.disable();
        const typePersonneControl = this.formIdentification.get('type_personne');
        const gererValidationTypeUtilisateur = (value: string) => {
            if (value === TypeUtilisateur.PERSONNE) {
                this.displayPersonne = true;
            } else {
                this.displayPersonne = false;
            }
        };
        gererValidationTypeUtilisateur(typePersonneControl?.value);
        typePersonneControl?.valueChanges.subscribe((value) => {
            gererValidationTypeUtilisateur(value);
        });

        const accepteControl = this.formIdentification.get('accepte');
        const commentaireControl = this.formIdentification.get('commentaire');
        const gererValidationCommentaire = (value: string) => {
            if (value === 'non') {
                this.isRequiredCommentaire = true;
                commentaireControl?.setValidators([Validators.required]);
            } else {
                this.isRequiredCommentaire = false;
                commentaireControl?.clearValidators();
            }
            commentaireControl?.updateValueAndValidity();
        };
        gererValidationCommentaire(accepteControl?.value);
        accepteControl?.valueChanges.subscribe((value) => {
            gererValidationCommentaire(value);
        });
    }

    private disabledPrendreField(): boolean {
        return (this.isStartWorkedDay() || this.typeTraitement?.visualiser);
    }

    public isStartWorkedDay(): boolean {
        return (this.startedDay !== 'démarré' && (this.userRole === 'superviseur' || this.userRole === 'gestionnaire'));
    }

    async PostGestionIdentificationsFileAttentesTraiter(dataToSend = { ...this.formIdentification.value }): Promise<void> {
        // const htmlMessage = this.formIdentification.get("accepte")?.value === "oui" ?
        //     `L'identification de la SIM <span style="color: #ff6600;"><strong>{sim.msisdn}</strong></span> sera <u style="color: #569C5B;">acceptée</u> !` :
        //     `L'identification de la SIM <span style="color: #ff6600;"><strong>{sim.msisdn}</strong></span> sera <u style="color: #E74C3C;">rejeté</u> !`;
        // const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass })
        //     .fire({
        //         ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage
        //             .replace('{sim.msisdn}', this.sim?.["msisdn"])
        //     });
        // if (result.isConfirmed) {
        //     const response: any = await handle(() => this.gestionIdentificationsService.PostGestionIdentificationsValiderIdentifications(dataToSend), this.toastrService, this.loadingBarService);
        //     if (response.error === false) {
        //         this.toastrService.success(response?.message);
        //         this.handleCloseModal();
        //         this.sharedDataService.sendGestionIdentificationsEquipementsConnectes();
        //         this.sharedDataService.sendGestionIdentificationsPersonnesPhysique();
        //         this.saveNumberNotifications(response);
        //         this.saveObjectifJournalier(response);
        //     };
        // }
    }

    async PostSupervisionOperationsTraitementsSuivisPrendreDemandeService(): Promise<void> {
        // const htmlMessage = `La SIM <span style="color: #ff6600;"><strong>{sim.msisdn}</strong></span> sera prise en charge !`;
        // const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass }).fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage.replace('{sim.msisdn}', this.sim?.["msisdn"]) });
        // if (result.isConfirmed) {
        //     const response: any = await handle(() => this.gestionIdentificationsService.GetAllFileAttentesPrendre({ transactions: [this.sim?.["transaction"]] }), this.toastrService, this.loadingBarService);
        //     if (response.error === false) {
        //         this.toastrService.success(response?.message);
        //         this.handleCloseModal();
        //         this.sharedDataService.sendGestionIdentificationsFileAttente();
        //         this.saveNumberNotifications(response);
        //         this.saveObjectifJournalier(response);
        //     };
        // };
    }

    
  async handleLiberer(): Promise<void> {
    // const htmlMessage = `La SIM <span style="color: #ff6600;"><strong>{sim.msisdn}</strong></span> sera <strong><u>libérées</u></strong>.`;
    // const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass }).fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage.replace('{sim.msisdn}', this.sim?.["msisdn"]) });
    // if (result.isConfirmed) {
    //   const response: any = await handle(() => this.gestionIdentificationsService.PostGestionIdentificationsValiderLiberer({ transaction: this.sim?.["transaction"] }), this.toastrService, this.loadingBarService);
    //   if (response.error === false) {
    //     this.toastrService.success(response?.message);
    //     this.handleCloseModal();
    //     this.sharedDataService.sendGestionIdentificationsEquipementsConnectes();
    //     this.sharedDataService.sendGestionIdentificationsPersonnesPhysique();
    //     this.saveNumberNotifications(response);
    //     this.saveObjectifJournalier(response);
    // };
    // }
  }

    public handleCloseModal(): void {
        this.visibleForm.emit(false);
    }
}