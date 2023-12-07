import { TraitementTransaction } from '../../enum/TraitementTransaction.enum';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { SupervisionOperationService } from '../../../presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { SettingService } from 'src/shared/services/setting.service';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
import { Justificatif } from 'src/shared/enum/Justificatif.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { formDataBuilder } from 'src/shared/constants/formDataBuilder.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OPERATION_PROVISIONNING, PATRIMOINE, SUPERVISION_OPERATIONS } from 'src/shared/routes/routes';
import { CONTENCIEUX, SUPERVISION_SUIVIE_TRAITEMENT } from 'src/presentation/pages/supervision-operations/supervision-operations-routing.module';
import { TRANSACTION_SIM } from 'src/presentation/pages/patrimoine/patrimoine-routing.module';
import { COMMANDE_SIM, LIGNE_CREDIT } from 'src/presentation/pages/provisionning/provisionning-routing.module';
import { ProvisionningService } from 'src/presentation/pages/provisionning/data-access/provisionning.service';
declare var require;
const Swal = require("sweetalert2");

@Component({
  selector: 'app-traitement-show',
  templateUrl: './traitement-show.component.html',
  styleUrls: ['./traitement-show.component.scss']
})
export class TraitementShowComponent implements OnInit {

  @Input() transaction;
  @Output() resultTraitement = new EventEmitter();
  public detailTransaction: any;
  public fileUrl: string;
  public filterTab: string;
  public listTraitemants: Array<any> = [];
  public operationLigneCredit: string = OperationTransaction.PROVISIONNING;
  public operationActivation: string = OperationTransaction.ACTIVATION
  public operationSwap: string = OperationTransaction.SWAP
  public OperationResiliation: string = OperationTransaction.RESILIATION
  public OperationSuspension: string = OperationTransaction.SUSPENSION
  public OperationVolumeData: string = OperationTransaction.VOLUME_DATA
  public OperationAchat: string = OperationTransaction.ACHAT_SERVICE
  public justificatifError: string = 'AUCUN JUSTIFICATIF POUR CETTE TRANSACTION'
  public creditForm: FormGroup;
  public listTypeJustificatif: Array<any> = [];
  public listProducts: Array<any> = [];
  public listFirstLevel: Array<any> = [];
  public listSecondLevel: Array<any> = [];
  public listThirdLevel: Array<any> = [];
  public listUsages: Array<any> = [];
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
  public currentFile: any;
  public TextInfosSim: string = "Orange fournira la SIM. A l' issue de l' operation, la SIM sera livrée au point de contact accompagnée d'une facture";
  public TextInfosVolume: string = "Orange CI fournira le volume, à l'issue de l'operation une facture instantannée sera produite";
  public selectedNotation: string;
  public selectedIsCloture: string;
  public selectedDescriptionNotation: string;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService,
    private provisionningService: ProvisionningService,
    private router: Router
  ) {
    Object.values(Justificatif).forEach(item => {
      this.listTypeJustificatif.push(item);
    });
    this.fileUrl = this.mappingService.fileUrl;  
      
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
    this.OnInitAchatForm();
    this.isAccepteForms();
    this.IsCancel();
    this.IsUpdate();
    this.IsCloture();
    this.IsReject();
    this.IsShow();
    this.IsEmptyPanier()
    this.IsVerify();
    this.IsContentSim()
    this.IsProvisionningTransaction()
    this.IsAchatTransaction()    
    this.IscurrentDate()
  }

  public GetDetailTransaction() {
    this.supervisionOperationService
      .GetDetailTransaction({
        transaction: this.transaction?.transaction,
        operation: this.transaction?.operation,
        ...(this.router.url !== `/${PATRIMOINE}/${TRANSACTION_SIM}` ? { model_id: this.transaction?.model_id } : { model_id: this.transaction?.demande_id }),
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
            this.GetFirstLevel();
            this.GetSecondLevel();
            this.GetThirdLevel();
            this.GetAllUsages();
            this.OnShowActivationForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACHAT_SERVICE) {
            this.OnShowAchatForm();
          }
          if (this.IsShow() || this.IsCloture()) {
            this.activationForm.disable();
            this.ligneForm.disable();
            this.volumeForm.disable();
            this.swapForm.disable();
            this.resiliationForm.disable();
            this.suspensionForm.disable();
          }
        },
        error: (error) => {
          this.OnFeebackTransaction();
          this.toastrService.error(error.error.message);
        }
      })
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

  OnFeebackTransaction(){
     if (this.router.url === `/${SUPERVISION_OPERATIONS}/${SUPERVISION_SUIVIE_TRAITEMENT}`) {
        return this.GetAllTraitement()
     }else if(this.router.url === `/${SUPERVISION_OPERATIONS}/${CONTENCIEUX}`){
      return this.GetAllContencieux()
     }
  }
  public GetAllTraitement() {
    this.supervisionOperationService
      .GetAllTransactions({}, 1)
      .subscribe({
        next: (response) => {
          this.listTraitemants =  response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return {...data,current_date: data?.date_traitement}
            }else if (data?.statut === StatutTransaction.CLOTURER) {
              return {...data,current_date: data?.date_cloture}
            }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return {...data,current_date: data?.date_acquittement}
            }else{
              return {...data,current_date: 'N/A'}
            } 
          });          
          this.resultTraitement.emit(this.listTraitemants);
          this.activeModal.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllContencieux() {
    this.supervisionOperationService
      .GetAllContencieux({})
      .subscribe({
        next: (response) => {
          this.listTraitemants =  response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return {...data,current_date: data?.date_traitement}
            }else if (data?.statut === StatutTransaction.CLOTURER) {
              return {...data,current_date: data?.date_cloture}
            }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return {...data,current_date: data?.date_acquittement}
            }else{
              return {...data,current_date: 'N/A'}
            } 
          });          
          this.resultTraitement.emit(this.listTraitemants);
          this.activeModal.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
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
      type_justificatif: [''],
      description: [''],
      provisionning_accepte: [''],
      provisionning_accepte_comment: ['']
    })
  }
  OnShowLigneForm() {
    this.ligneForm.get('montant').patchValue(this.detailTransaction?.montant);
    this.ligneForm.get('type_justificatif').patchValue(this.detailTransaction?.type_justificatif);
    this.ligneForm.get('description').patchValue(this.detailTransaction?.description);
    this.ligneForm.get('provisionning_accepte').patchValue(this.detailTransaction?.rapport?.provisionning_accepte);
    this.ligneForm.get('provisionning_accepte_comment').patchValue(this.detailTransaction?.rapport?.provisionning_accepte_comment);
  }
  downloadFile() {
    if (!this.detailTransaction?.justificatif) {
      this.toastrService.warning('Pas de justificatif pour cette operation')
    }else{
          window.open(this.fileUrl + this.detailTransaction?.justificatif)
    }
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Volume Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitVolumeForm() {
    this.volumeForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      point_emplacement: [''],
      bac_a_pioche: [''],
      description: [''],
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
    this.volumeForm.get('description').patchValue(this.detailTransaction?.description);
    this.volumeForm.get('volume_data_accepte').patchValue(this.detailTransaction?.rapport?.volume_data_accepte);
    this.volumeForm.get('volume_data_accepte_comment').patchValue(this.detailTransaction?.rapport?.volume_data_accepte_comment);
    this.volumeForm.get('msisdn').disable();
    this.volumeForm.get('statut').disable();
    this.volumeForm.get('beneficiaire').disable();
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
    this.swapForm.get('msisdn').disable();
    this.swapForm.get('statut_contrat').disable();
    this.swapForm.get('point_emplacement').disable();
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
      justificatif: [''],
      point_emplacement: [''],
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
    this.resiliationForm.get('msisdn').disable();
    this.resiliationForm.get('statut_contrat').disable();
    this.resiliationForm.get('point_emplacement').disable();
  }
  public onChangeFile(file: FileList) {
    this.currentFile = file.item(0);
  }
  /*@@@@@@@@@@@@@@@@@@@@@@Suspension Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitSuspensionForm() {
    this.suspensionForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      justificatif: [''],
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
    this.suspensionForm.get('msisdn').disable();
    this.suspensionForm.get('statut_contrat').disable();
    this.suspensionForm.get('point_emplacement').disable();
  }

  /*@@@@@@@@@@@@@@@@@@@ Activation Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitActivationForm() {
    this.activationForm = this.fb.group({
      bac_a_pioche: [''],
      niveau_un_id: [''],
      niveau_deux_id: [''],
      niveau_trois_id: [''],
      usage_id: [''],
      point_emplacement: [''],
      adresse_email: [''],
      adresse_geographique: [''],
      latitude: [''],
      longitude: [''],
      activation_accepte: [''],
      activation_accepte_comment: ['']
    })
  }
  OnShowActivationForm() {
    this.activationForm.get('bac_a_pioche').patchValue(this.detailTransaction?.bac_a_pioche);
    this.activationForm.get('niveau_un_id').patchValue(this.detailTransaction?.niveau_un_id);
    this.activationForm.get('niveau_deux_id').patchValue(this.detailTransaction?.niveau_deux_id);
    this.activationForm.get('niveau_trois_id').patchValue(this.detailTransaction?.niveau_trois_id);
    this.activationForm.get('usage_id').patchValue(this.detailTransaction?.usage_id);
    this.activationForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.activationForm.get('adresse_email').patchValue(this.detailTransaction?.adresse_email);
    this.activationForm.get('adresse_geographique').patchValue(this.detailTransaction?.adresse_geographique);
    this.activationForm.get('latitude').patchValue(this.detailTransaction?.latitude);
    this.activationForm.get('longitude').patchValue(this.detailTransaction?.longitude);
    this.activationForm.get('activation_accepte').patchValue(this.detailTransaction?.rapport?.activation_accepte);
    this.activationForm.get('activation_accepte_comment').patchValue(this.detailTransaction?.rapport?.activation_accepte_comment);
  }

  get bacPiocheActivation() {
    return this.activationForm.get('bac_a_pioche').value;
  }

  /*@@@@@@@@@@@@@@@@@@@ Achat Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitAchatForm() {
    this.achatForm = this.fb.group({
      detail_commande: [''],
      commmande_produit_accepte: [''],
      commmande_produit_accepte_comment: ['']
    })
  }
  OnShowAchatForm() {
    this.achatForm.get('commmande_produit_accepte').patchValue(this.detailTransaction?.rapport?.commmande_produit_accepte);
    this.achatForm.get('commmande_produit_accepte_comment').patchValue(this.detailTransaction?.rapport?.commmande_produit_accepte_comment);
  }

  IsEmptyPanier(): any {
    if (this.detailTransaction?.detail_commande?.length === 0) {
      return this.OnFeebackTransaction()
    }
  }
  OnIncrementButton(data: any) {
    let findProduct = this.detailTransaction?.detail_commande.find((it) => it.id === data.id);
    if (findProduct === undefined) {
      this.detailTransaction?.detail_commande.push(data);
    } else {
      findProduct.quantite += 1;
    }
  }
  OnDecrementButton(data: any) {
    if (data.quantite <= 1) {
      return;
    } else {
      data.quantite -= 1;
    }
  }
  RemoveFromPanier(data: any) {
    this.detailTransaction?.detail_commande.forEach((value, index) => {
      if (value == data) {
        this.detailTransaction?.detail_commande.splice(index, 1);
      }
    });
  }

  public GetFirstLevel() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listFirstLevel = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetSecondLevel() {
    this.settingService
      .getAllExploiatations({})
      .subscribe({
        next: (response) => {
          this.listSecondLevel = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetThirdLevel(): void {
    this.settingService
      .getAllZones({})
      .subscribe({
        next: (response) => {
          this.listThirdLevel = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllUsages() {
    this.patrimoineService
      .GetAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsages = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
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
  public isAccepteForms(): boolean {
    return (
      this.detailTransaction?.rapport?.provisionning_accepte === 'oui' ||
      this.detailTransaction?.rapport?.volume_data_accepte === 'oui' ||
      this.detailTransaction?.rapport?.swap_accepte === 'oui' ||
      this.detailTransaction?.rapport?.suspension_accepte === 'oui' ||
      this.detailTransaction?.rapport?.resiliation_accepte === 'oui' ||
      this.detailTransaction?.rapport?.activation_accepte === 'oui'
    ) ? false : true
  }
  public IsCancel(): boolean {
    return ((this.transaction?.statut === StatutTransaction.SOUMIS && (this.transaction?.traitement === TraitementTransaction.EN_ENTENTE || this.transaction?.traitement === TraitementTransaction.ACQUITER))) ? true : false
  }
  public IsUpdate(): boolean {
    return ((this.transaction?.statut === StatutTransaction.SOUMIS && (this.transaction?.traitement === TraitementTransaction.EN_ENTENTE || this.transaction?.traitement === TraitementTransaction.ACQUITER))
      || (this.transaction?.statut === StatutTransaction.TARITER && this.transaction?.traitement === TraitementTransaction.REJETER)
    ) ? true : false
  }
  IsReject() {
    return (this.transaction?.statut === StatutTransaction.TARITER && this.transaction?.traitement === TraitementTransaction.REJETER) ? true : false
  }
  public IsCloture(): boolean {
    return ((this.transaction?.statut === StatutTransaction.TARITER && this.transaction?.traitement === TraitementTransaction.ACCEPTER)) ? true : false
  }
  public IsShow(): boolean {
    return (this.transaction?.statut === StatutTransaction.CLOTURER) ? true : false
  }
  public IsVerify(): boolean {
    return (
      this.transaction?.operation === OperationTransaction.SWAP ||
      this.transaction?.operation === OperationTransaction.RESILIATION ||
      this.transaction?.operation === OperationTransaction.SUSPENSION ||
      this.transaction?.operation === OperationTransaction.VOLUME_DATA
    ) ? true : false
  }
  public IscurrentDate(): string {
    if (this.transaction?.statut === StatutTransaction.TARITER) {
      return this.detailTransaction?.rapport?.date_traitement
    }else if (this.transaction?.statut === StatutTransaction.CLOTURER) {
      return this.detailTransaction?.rapport?.date_cloture
    }else if ((this.transaction?.traitement === StatutTransaction.SOUMIS) && (this.transaction?.traitement === TraitementTransaction.ACQUITER)) {
      return this.detailTransaction?.rapport?.date_acquittement
    }    
  }
  OnVerify() {
    Swal.fire({
      title: "En êtes vous sûr ?",
      html: `Veuillez proceder à la verification<strong><u>L'imsi</u></strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        this.patrimoineService
          .OnVerify({
            imsi: this.swapForm.get('imsi').value,
          })
          .subscribe({
            next: (response) => {
              const data = response['data']              
              this.swapForm.get('msisdn').patchValue(data?.msisdn);
              this.swapForm.get('statut').patchValue(data?.statut);
              this.swapForm.get('point_emplacement').patchValue(data?.point_emplacement);
              this.toastrService.success(response.message);
              this.OnUpdateTransaction();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public OnUpdateTransaction(): void {
    Swal.fire({
      title: "En êtes vous sûr ?",
      html: `Les informations de mise à jour de la transaction <strong><u>${this.detailTransaction.rapport.transaction}</u></strong> seront enregistrées.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        if (this.transaction?.operation === OperationTransaction.RESILIATION) {
          this.resiliationForm.patchValue({
            justificatif: this.currentFile,
          })
        } else if (this.transaction?.operation === OperationTransaction.SUSPENSION) {
          this.suspensionForm.patchValue({
            justificatif: this.currentFile,
          })
        } else if (this.transaction?.operation === OperationTransaction.PROVISIONNING) {
          this.ligneForm.patchValue({
            justificatif: this.currentFile,
          })
        } else if (this.transaction?.operation === OperationTransaction.ACHAT_SERVICE) {
          this.achatForm.patchValue({
            detail_commande: this.detailTransaction?.detail_commande
          })
        }
        const data = {
          ...(
            this.transaction?.operation === OperationTransaction.PROVISIONNING
              ? this.ligneForm.value :
              this.transaction?.operation === OperationTransaction.ACHAT_SERVICE
                ? this.achatForm.value :
                this.transaction?.operation === OperationTransaction.VOLUME_DATA
                  ? this.volumeForm.value :
                  this.transaction?.operation === OperationTransaction.SWAP
                    ? this.swapForm.value :
                    this.transaction?.operation === OperationTransaction.RESILIATION
                      ? this.resiliationForm.value :
                      this.transaction?.operation === OperationTransaction.SUSPENSION
                        ? this.suspensionForm.value :
                        this.transaction?.operation === OperationTransaction.ACTIVATION
                          ? this.activationForm.value :
                          this.achatForm.value
          ),
          transaction: this.transaction?.transaction,
          operation: this.transaction.operation,
          model_id: this.transaction.model_id
        }
        this.supervisionOperationService
          .OnUpdateTransaction((this.transaction?.operation === OperationTransaction.RESILIATION || this.transaction?.operation === OperationTransaction.SUSPENSION || this.transaction?.operation === OperationTransaction.PROVISIONNING) ? formDataBuilder(data) : data)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.OnFeebackTransaction();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });

  }
  public OnCancelTransaction(): void {
    Swal.fire({
      title: "En êtes vous sûr ?",
      html: `Voulez-vous Abandonner la transaction <strong><u>${this.detailTransaction.rapport.transaction}</u></strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        this.supervisionOperationService
          .OnCancelTransaction({
            transaction: this.transaction?.transaction,
            operation: this.transaction.operation,
            model_id: this.transaction.model_id,
          })
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.OnFeebackTransaction();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public OnCloseTransaction(): void {
    Swal.fire({
      title: "En êtes vous sûr ?",
      html: `Voulez-vous Clôturer la transaction <strong><u>${this.detailTransaction.rapport.transaction}</u></strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        this.supervisionOperationService
          .OnCloseTransaction({
            transaction: this.transaction?.transaction,
            operation: this.transaction.operation,
            model_id: this.transaction.model_id,
            notation_cloture: this.selectedNotation,
            notation_description: this.selectedDescriptionNotation,
            commmande_produit_cloture: this.selectedIsCloture,
            ...(
              this.transaction?.operation === OperationTransaction.PROVISIONNING ? {provisionning_cloture: this.selectedIsCloture} :
              this.transaction?.operation === OperationTransaction.ACHAT_SERVICE ? {commmande_produit_cloture: this.selectedIsCloture} :
              this.transaction?.operation === OperationTransaction.VOLUME_DATA ? {volume_data_cloture: this.selectedIsCloture} :
              this.transaction?.operation === OperationTransaction.SWAP ? {swap_cloture: this.selectedIsCloture} :
              this.transaction?.operation === OperationTransaction.RESILIATION ? {resiliation_cloture: this.selectedIsCloture} :
              this.transaction?.operation === OperationTransaction.SUSPENSION ? {suspension_cloture: this.selectedIsCloture} :
              this.transaction?.operation === OperationTransaction.ACTIVATION ? {activation_cloture: this.selectedIsCloture} : null
            ),
          })
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.OnFeebackTransaction();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  handleChangeEvent(event){
    const currentEvent = event.target.value
    if (currentEvent === 'non') {
       this.selectedNotation = 'mécontent'
    }
  }

  public copyTransaction(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public handleCloseModal(): void {
    this.OnFeebackTransaction()
  }
}
