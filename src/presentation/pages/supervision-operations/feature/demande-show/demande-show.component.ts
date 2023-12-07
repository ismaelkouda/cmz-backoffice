import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { SettingService } from 'src/shared/services/setting.service';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { Justificatif } from 'src/shared/enum/Justificatif.enum';
import { MappingService } from 'src/shared/services/mapping.service';
declare var require;
const Swal = require("sweetalert2");

@Component({
  selector: 'app-demande-show',
  templateUrl: './demande-show.component.html',
  styleUrls: ['./demande-show.component.scss']
})
export class DemandeShowComponent implements OnInit {

  @Input() transaction;
  @Output() resultTraitement = new EventEmitter();
  public detailTransaction: any;
  public fileUrl: string;
  public filterTab: string;
  public operationLigneCredit: string = OperationTransaction.PROVISIONNING;
  public operationActivation: string = OperationTransaction.ACTIVATION
  public operationSwap: string = OperationTransaction.SWAP
  public OperationResiliation: string = OperationTransaction.RESILIATION
  public OperationSuspension: string = OperationTransaction.SUSPENSION
  public OperationVolumeData: string = OperationTransaction.VOLUME_DATA
  public OperationAchat: string = OperationTransaction.ACHAT_SERVICE
  public creditForm: FormGroup;
  public listTypeJustificatif: Array<any> = [];
  public listProducts: Array<any> = [];
  public selectedJustificatif: any;
  public typeFilterValue: string;
  public sourceValue: string;

  //Services Forms
  public ligneForm: FormGroup;
  public volumeForm: FormGroup;
  public swapForm: FormGroup;
  public resiliationForm: FormGroup;
  public suspensionForm: FormGroup;
  public activationForm: FormGroup;
  public adminForm: FormGroup;
  public achatForm: FormGroup;
  public isError: boolean = false;
  public TextInfosSim: string = "Orange fournira la SIM. A l' issue de l' operation, la SIM sera livrée au point de contact accompagnée d'une facture";
  public TextInfosVolume: string = "Orange CI fournira le volume, à l'issue de l'operation une facture instantannée sera produite";
  public currentArrayHeaders = [];
  public currentSheetForm: any;
  public currentSheetFormValidate: boolean = false;
  public fileModel: any;
  public typeOuvrage: any;
  public arrayHeaderExcelFile: Array<any> = [];
  public arrayContentExcelFile: Array<any> = [];
  public fileName: string;
  public currentData: any;
  public validateArray: any = [];
  public currentVolP: any;
  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;


  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService,
    private mappingService: MappingService

  ) {
    Object.values(Justificatif).forEach(item => {
      this.listTypeJustificatif.push(item);
    });
    this.fileUrl = mappingService.fileUrl;
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    console.log("transaction", this.transaction);
    this.filterItem("first-item");
    this.GetDetailTransaction();
    this.OnInitLigneForm();
    this.OnInitVolumeForm();
    this.OnInitSwapForm();
    this.OnInitResiliationForm();
    this.OnInitSuspensionForm();
    this.OnInitActivationForm();
    this.OnInitAchatForm()
    this.isAccepteForms();
    this.IsShow()
    this.IsEmptySheeetForm()
    this.IsContentSim()
    this.IsProvisionningTransaction()
    this.IsAchatTransaction()    
  }

  public GetDetailTransaction() {
    this.supervisionOperationService
      .GetDetailTransaction({
        transaction: this.transaction?.transaction,
        operation: this.transaction?.operation,
        model_id: this.transaction?.model_id,
        tenant_id: this.transaction?.tenant_id
      })
      .subscribe({
        next: (response) => {
          this.detailTransaction = response['data'];
          if (this.detailTransaction?.operation === OperationTransaction.PROVISIONNING) {
            this.OnShowLigneForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.VOLUME_DATA) {
            this.OnShowVolumeForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.SWAP) {
            this.OnShowSwapForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.RESILIATION) {
            this.OnShowResiliationForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.SUSPENSION) {
            this.OnShowSuspensionForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACTIVATION) {
            this.OnShowActivationForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACHAT_SERVICE) {
            this.OnShowAchatForm();
            this.currentVolP = this.detailTransaction?.detail_commande.filter(item => {
              return item.code_produit === 'VOL-P'
            });
          }
            this.activationForm.disable();
            this.ligneForm.disable();
            this.volumeForm.disable();
            this.swapForm.disable();
            this.resiliationForm.disable();
            this.suspensionForm.disable();
            this.achatForm.disable();
        },
        error: (error) => {
          this.GetAllTransactions();
          this.isError = true;
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllTransactions() {
    this.supervisionOperationService
      .GetAllTransactions({}, 1)
      .subscribe({
        next: (response) => {
          this.resultTraitement.emit(response['data']);
          this.activeModal.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public mappingNotation(notation): string {
    switch (notation) {
      case 'mécontent': {
        return 'assets/images/icones/sad.png';
      }
      case 'neutre': {
        return 'assets/images/icones/confused.png';
      }
      case 'content': {
        return 'assets/images/icones/smile.png';
      }
    }
  }
  public filterItem(status: string): string {
    this.filterTab = status;
    return this.filterTab
  }
  public pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }
  /*@@@@@@@@@@@ Ligne Form Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitLigneForm() {
    this.ligneForm = this.fb.group({
      montant: [''],
      justificatif: [''],
      url: [''],
      description: [''],
      provisionning_accepte: [''],
      provisionning_accepte_comment: ['', [Validators.required]]
    })
  }
  OnShowLigneForm() {
    this.ligneForm.get('montant').patchValue(this.detailTransaction?.montant);
    this.ligneForm.get('justificatif').patchValue(this.detailTransaction?.type_justificatif);
    this.ligneForm.get('description').patchValue(this.detailTransaction?.description);
    this.ligneForm.get('provisionning_accepte').patchValue(this.detailTransaction?.rapport?.provisionning_accepte);
    this.ligneForm.get('provisionning_accepte_comment').patchValue(this.detailTransaction?.rapport?.provisionning_accepte_comment);
    this.ligneForm.disable();
    if (this.ligneForm.get('provisionning_accepte').value === 'non' || this.ligneForm.get('provisionning_accepte').value === null) {
      this.ligneForm.get('provisionning_accepte').enable();
      this.ligneForm.get('provisionning_accepte_comment').enable();
    }
  }
  downloadFile() {
    if (!this.detailTransaction?.justificatif) {
      this.toastrService.warning('Pas de justificatif pour cette operation')
    }else{
          window.open(this.fileUrl + this.detailTransaction?.justificatif)
    }
  }
  downloadModal() {
    window.open('../../../../../assets/data/format_cmd.xlsx')
  }
  /*@@@@@@@@@@@@@@@@@@@@@@Volume Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitVolumeForm() {
    this.volumeForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      point_emplacement: [],
      bac_a_pioche: [''],
      volume: [''],
      volume_data_accepte: [''],
      volume_data_accepte_comment: ['']
    })
  }
  OnShowVolumeForm() {
    this.volumeForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.volumeForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.volumeForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.volumeForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.volumeForm.get('bac_a_pioche').patchValue(this.detailTransaction?.bac_a_pioche);
    this.volumeForm.get('volume').patchValue(this.detailTransaction?.volume);
    this.volumeForm.get('volume_data_accepte').patchValue(this.detailTransaction?.rapport?.volume_data_accepte);
    this.volumeForm.get('volume_data_accepte_comment').patchValue(this.detailTransaction?.rapport?.volume_data_accepte_comment);
    this.volumeForm.disable();
    if (this.volumeForm.get('volume_data_accepte').value === 'non' || this.volumeForm.get('volume_data_accepte').value === null) {
      this.volumeForm.get('volume_data_accepte').enable();
      this.volumeForm.get('volume_data_accepte_comment').enable();
    }
  }
  get sourceStock() {
    return this.volumeForm.get('bac_a_pioche').value;
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Swap Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitSwapForm() {
    this.swapForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      point_emplacement: [''],
      bac_a_pioche: [''],
      description: [''],
      swap_accepte: [''],
      swap_accepte_comment: ['']
    })
  }
  OnShowSwapForm() {
    this.swapForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.swapForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.swapForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.swapForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.swapForm.get('bac_a_pioche').patchValue(this.detailTransaction?.bac_a_pioche);
    this.swapForm.get('description').patchValue(this.detailTransaction?.description);
    this.swapForm.get('swap_accepte').patchValue(this.detailTransaction?.rapport?.swap_accepte);
    this.swapForm.get('swap_accepte_comment').patchValue(this.detailTransaction?.rapport?.swap_accepte_comment);
    this.swapForm.disable();
    if (this.swapForm.get('swap_accepte').value === 'non' || this.swapForm.get('swap_accepte').value === null) {
      this.swapForm.get('swap_accepte').enable();
      this.swapForm.get('swap_accepte_comment').enable();
    }
  }
  get sourceStockSwap() {
    return this.swapForm.get('bac_a_pioche').value;
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Resiliation Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitResiliationForm() {
    this.resiliationForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      point_emplacement: [],
      description: [''],
      resiliation_accepte: [''],
      resiliation_accepte_comment: ['']
    })
  }
  OnShowResiliationForm() {
    this.resiliationForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.resiliationForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.resiliationForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.resiliationForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.resiliationForm.get('description').patchValue(this.detailTransaction?.description);
    this.resiliationForm.get('resiliation_accepte').patchValue(this.detailTransaction?.rapport?.resiliation_accepte);
    this.resiliationForm.get('resiliation_accepte_comment').patchValue(this.detailTransaction?.rapport?.resiliation_accepte_comment);
    this.resiliationForm.disable();
    if (this.resiliationForm.get('resiliation_accepte').value === 'non' || this.resiliationForm.get('resiliation_accepte').value === null) {
      this.resiliationForm.get('resiliation_accepte').enable();
      this.resiliationForm.get('resiliation_accepte_comment').enable();
    }
  }
  /*@@@@@@@@@@@@@@@@@@@@@@Suspension Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitSuspensionForm() {
    this.suspensionForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      point_emplacement: [''],
      description: [''],
      suspension_accepte: [''],
      suspension_accepte_comment: ['']
    })
  }
  OnShowSuspensionForm() {
    this.suspensionForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.suspensionForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.suspensionForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.suspensionForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.suspensionForm.get('description').patchValue(this.detailTransaction?.description);
    this.suspensionForm.get('suspension_accepte').patchValue(this.detailTransaction?.rapport?.suspension_accepte);
    this.suspensionForm.get('suspension_accepte_comment').patchValue(this.detailTransaction?.rapport?.suspension_accepte_comment);
    this.suspensionForm.disable();
    if (this.suspensionForm.get('suspension_accepte').value === 'non' || this.suspensionForm.get('suspension_accepte').value === null) {
      this.suspensionForm.get('suspension_accepte').enable();
      this.suspensionForm.get('suspension_accepte_comment').enable();
    }
  }

  /*@@@@@@@@@@@@@@@@@@@ Activation Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitActivationForm() {
    this.activationForm = this.fb.group({
      bac_a_pioche: [''],
      niveau_1: [''],
      niveau_2: [''],
      niveau_3: [''],
      usage: [''],
      point_emplacement: [''],
      email: [''],
      adresse_geographique: [''],
      latitude: [''],
      longitude: [''],
      activation_accepte: [''],
      activation_accepte_comment: ['']
    })
  }
  OnShowActivationForm() {
    this.activationForm.get('bac_a_pioche').patchValue(this.detailTransaction?.bac_a_pioche);
    this.activationForm.get('niveau_1').patchValue(this.detailTransaction?.niveau_uns_nom);
    this.activationForm.get('niveau_2').patchValue(this.detailTransaction?.niveau_deux_nom)
    this.activationForm.get('niveau_3').patchValue(this.detailTransaction?.niveau_trois_nom);
    this.activationForm.get('usage').patchValue(this.detailTransaction?.usage_nom);
    this.activationForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.activationForm.get('email').patchValue(this.detailTransaction?.adresse_email);
    this.activationForm.get('adresse_geographique').patchValue(this.detailTransaction?.adresse_geographique);
    this.activationForm.get('latitude').patchValue(this.detailTransaction?.latitude);
    this.activationForm.get('longitude').patchValue(this.detailTransaction?.longitude);
    this.activationForm.get('activation_accepte').patchValue(this.detailTransaction?.rapport?.activation_accepte);
    this.activationForm.get('activation_accepte_comment').patchValue(this.detailTransaction?.rapport?.activation_accepte_comment);
    this.activationForm.disable();
    if (this.activationForm.get('activation_accepte').value === 'non' || this.activationForm.get('activation_accepte').value === null) {
      this.activationForm.get('activation_accepte').enable();
      this.activationForm.get('activation_accepte_comment').enable();
    }
  }

  get bacPiocheActivation() {
    return this.activationForm.get('bac_a_pioche').value;
  }

  /*@@@@@@@@@@@@@@@@@@@ Achat Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitAchatForm() {
    this.achatForm = this.fb.group({
      commmande_produit_accepte: [''],
      commmande_produit_accepte_comment: ['']
    })
  }
  OnShowAchatForm() {
    this.achatForm.get('commmande_produit_accepte').patchValue(this.detailTransaction?.rapport?.commmande_produit_accepte);
    this.achatForm.get('commmande_produit_accepte_comment').patchValue(this.detailTransaction?.rapport?.commmande_produit_accepte_comment);
    this.achatForm.disable();
    if (this.achatForm.get('commmande_produit_accepte').value === 'non' || this.achatForm.get('commmande_produit_accepte').value === null) {
      this.achatForm.get('commmande_produit_accepte').enable();
      this.achatForm.get('commmande_produit_accepte_comment').enable();
    }
  }


  public handleCloseModal(): void {
    this.GetAllTransactions()
  }
  public formatTitleOuvrage(title: string) {
    switch (title) {
      case OperationTransaction.ACTIVATION: {
        return "Activation de SIM";
      }
      case OperationTransaction.SWAP: {
        return "Changement de SIM";
      }
      case OperationTransaction.RESILIATION: {
        return "Résiliation de SIM";
      }
      case OperationTransaction.SUSPENSION: {
        return "Suspension de SIM";
      }
      case OperationTransaction.VOLUME_DATA: {
        return "Depot de volume";
      }
      case OperationTransaction.ACHAT_SERVICE: {
        return "Achat de Services";
      }
      case OperationTransaction.PROVISIONNING: {
        return 'Ligne de Credit';
      }
    }
  }
  public GetCurrentMessage(operation): string {
    switch (operation) {
      case OperationTransaction.ACTIVATION: {
        return this.activationForm.get('activation_accepte_comment').value;
      }
      case OperationTransaction.SWAP: {
        return this.swapForm.get('swap_accepte_comment').value;
      }
      case OperationTransaction.RESILIATION: {
        return this.resiliationForm.get('resiliation_accepte_comment').value;
      }
      case OperationTransaction.SUSPENSION: {
        return this.suspensionForm.get('suspension_accepte_comment').value;
      }
      case OperationTransaction.VOLUME_DATA: {
        return this.volumeForm.get('volume_data_accepte_comment').value;
      }
      case OperationTransaction.ACHAT_SERVICE: {        
        return this.achatForm.get('commmande_produit_accepte_comment').value;
      }
      case OperationTransaction.PROVISIONNING: {
        return this.ligneForm.get('provisionning_accepte_comment').value;
        ;
      }
      default:
        return 'Aucun Message Pour cette Transaction !'
    }
  }
  public IsContentSim(): boolean {
    return (
      this.transaction?.operation === OperationTransaction.ACTIVATION  ||
      this.transaction?.operation === OperationTransaction.RESILIATION ||
      this.transaction?.operation === OperationTransaction.SUSPENSION ||
      this.transaction?.operation === OperationTransaction.SWAP ||
      this.transaction?.operation === OperationTransaction.VOLUME_DATA 
    ) ? true : false
  }
  public IsProvisionningTransaction(): boolean {
    return (
      this.transaction?.operation === OperationTransaction.PROVISIONNING) ? true : false
  }
  public IsAchatTransaction(): boolean {
    return (
      this.transaction?.operation === OperationTransaction.ACHAT_SERVICE) ? true : false
  }

  public IsShow(): boolean {
    return (this.transaction?.statut === StatutTransaction.CLOTURER) ? true : false
  }
  public IsEmptySheeetForm(): boolean {
    if (this.transaction.operation === OperationTransaction.ACHAT_SERVICE) {
      return (!this.currentSheetFormValidate) ? true : false
    }
  }
  public isAccepteForms(): boolean {
    return (
      this.detailTransaction?.rapport?.provisionning_accepte === 'oui' ||
      this.detailTransaction?.rapport?.volume_data_accepte === 'oui' ||
      this.detailTransaction?.rapport?.swap_accepte === 'oui' ||
      this.detailTransaction?.rapport?.suspension_accepte === 'oui' ||
      this.detailTransaction?.rapport?.resiliation_accepte === 'oui' ||
      this.detailTransaction?.rapport?.activation_accepte === 'oui' ||
      this.detailTransaction?.rapport?.commmande_produit_accepte === 'oui'
    ) ? false : true
  }
  removeFile(prod) {
    prod.file = '';
  }
  downloadModelXls() {
    window.open(this.fileModel, "_blank");
  }

  

}