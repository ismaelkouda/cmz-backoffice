import { SUIVIE_TRAITEMENT_ROUTE, CONTENCIEUX_ROUTE } from './../../../presentation/pages/supervision-operations/supervision-operations-routing.module';
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
import { Router } from '@angular/router';
import { PATRIMOINE, SUPERVISION_OPERATIONS } from 'src/shared/routes/routes';
declare var require;
const Swal = require("sweetalert2");

@Component({
  selector: 'app-traitement-show',
  templateUrl: './traitement-show.component.html',
  styleUrls: ['./traitement-show.component.scss']
})
export class TraitementShowComponent implements OnInit {

  @Input() transaction;
  @Input() IsLoadData;
  @Output() resultTraitement = new EventEmitter();
  @Output() IsLoading = new EventEmitter();
  public detailTransaction: any;
  public fileUrl: string;
  public filterTab: string;
  public listTraitemants: Array<any> = [];
  public operationLigneCredit: string = OperationTransaction.PROVISIONNING;
  public operationActivation: string = OperationTransaction.ACTIVATION
  public operationSwap: string = OperationTransaction.SWAP
  public OperationResiliation: string = OperationTransaction.RESILIATION
  public OperationSuspension: string = OperationTransaction.SUSPENSION
  public OperationFormule: string = OperationTransaction.CHANGEMENT_FORMULE
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
  public listFormules: Array<any> = [];
  public selectedJustificatif: any;
  public typeFilterValue: string;
  public sourceValue: string;

  //Services Forms
  public ligneForm: FormGroup;
  public volumeForm: FormGroup;
  public swapForm: FormGroup;
  public resiliationForm: FormGroup;
  public reactivationForm: FormGroup;
  public suspensionForm: FormGroup;
  public formuleForm: FormGroup;
  public activationForm: FormGroup;
  public adminForm: FormGroup;
  public achatForm: FormGroup;
  public currentFile: any;
  public TextInfosVolume: string = "Orange CI fournira le volume, à l'issue de l'operation une facture instantannée sera produite";
  public selectedNotation: string;
  public selectedIsCloture: string;
  public selectedDescriptionNotation: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public sourceStockTenantSim: string;
  public sourceStockOrangeSim: string;
  public sourceSoldeDotation: string;
  public sourceSoldeDotationOrange: string
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenRefuser: string = TraitementTransaction.REFUSER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;


  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    public mappingService: MappingService,
    private router: Router
  ) {
    Object.values(Justificatif).forEach(item => {
      this.listTypeJustificatif.push(item);
    });
    this.fileUrl = this.mappingService.fileUrl;  
    this.sourceStockTenantSim = this.mappingService.sourceStockTenantSim,
    this.sourceStockOrangeSim = this.mappingService.sourceStockOrangeSim,
    this.sourceSoldeDotation = this.mappingService.sourceSoldeDotation,
    this.sourceSoldeDotationOrange = this.mappingService.sourceSoldeDotationOrange
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.filterItem("first-item");
    this.GetDetailTransaction();
    this.OnInitLigneForm();
    this.OnInitVolumeForm();
    this.OnInitSwapForm();
    this.OnInitResiliationForm();
    this.OnInitSuspensionForm();
    this.OnInitFormuleForm();
    this.OnInitActivationForm();
    this.OnInitAchatForm();
    this.isAccepteForms();
    this.IsTraitement()
    this.IsCancel();
    this.IsUpdate();
    this.IsCloture();
    this.IsReject();
    this.IsShow();
    this.IsNotMessage()
    this.IsJustificatif()
    this.IsEmptyPanier()
    this.IsVerify();
    this.IsContentSim()
    this.ShowAcceptedForm()
    this.IsProvisionningTransaction()
    this.IsAchatTransaction()    
    this.IscurrentDate()
  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public GetDetailTransaction() {
    this.IsLoading.emit(true);
    this.supervisionOperationService
      .GetDetailTransaction({
        transaction: this.transaction?.transaction,
        operation: this.transaction?.operation,
        ...(this.router.url !== `/${PATRIMOINE}/${""}` ? { model_id: this.transaction?.model_id } : { model_id: this.transaction?.demande_id }),
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
          }else if (this.detailTransaction?.operation === OperationTransaction.SUSPENSION) {
            this.OnShowSuspensionForm();
          }else if (this.detailTransaction?.operation === OperationTransaction.CHANGEMENT_FORMULE) {
            this.GetAllFormules()
            this.OnShowFormuleForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACTIVATION) {
            this.onGetDrValueChanges()
            this.GetFirstLevel();
            this.GetThirdLevel();
            this.GetAllUsages();
            this.OnShowActivationForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACHAT_SERVICE) {
            this.OnShowAchatForm();
          }
          if (this.IsShow() || this.IsCloture() || !this.mappingService.IsAction()) {
            this.activationForm.disable();
            this.ligneForm.disable();
            this.volumeForm.disable();
            this.swapForm.disable();
            this.resiliationForm.disable();
            this.suspensionForm.disable();
            this.formuleForm.disable();
          }
          if (this.ShowAcceptedForm()) {
            this.activationForm.get('activation_accepte_comment').disable()
            this.suspensionForm.get('suspension_accepte_comment').disable()
            this.formuleForm.get('chg_formule_accepte_comment').disable()
            this.resiliationForm.get('resiliation_accepte_comment').disable()
            this.swapForm.get('swap_accepte_comment').disable()
            this.volumeForm.get('volume_data_accepte_comment').disable()
            this.achatForm.get('commmande_produit_accepte_comment').disable()
            this.ligneForm.get('provisionning_accepte_comment').disable()
          }
          this.IsLoading.emit(false);
        },
        error: (error) => {
          this.handleCloseModal();
          this.IsLoading.emit(false);
          this.toastrService.error(error.error.message);
        }
      })
  }
  IsContencieutRouter(): boolean{
    if (this.router.url === `/${SUPERVISION_OPERATIONS}/${CONTENCIEUX_ROUTE}`) {
       return true
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
      case OperationTransaction.CHANGEMENT_FORMULE: {
        return this.formuleForm.get('chg_formule_accepte_comment').value;
        ;
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
  public OnGetRapportCodeStyle(code: any): string {    
    if (code.includes('100')) {
      return 'style100';
    } else if (code.includes('200')) {
      return 'style200';
    }else {
      return 'styledefault';
    }
  }

  OnFeebackTransaction(){
     if (this.router.url === `/${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`) {
        return this.GetAllTraitement()
     }else if(this.router.url === `/${SUPERVISION_OPERATIONS}/${CONTENCIEUX_ROUTE}`){
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
  IsJustificatif(): boolean{
    return (this.detailTransaction?.justificatif) ? true : false
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
      justificatif: [''],
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
    this.volumeForm.get('imsi').disable();
    this.volumeForm.get('point_emplacement').disable();
    this.volumeForm.get('statut_contrat').disable();
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
      justificatif: [''],
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
    this.swapForm.get('imsi').disable();
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
    this.resiliationForm.get('imsi').disable();
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
    this.suspensionForm.get('imsi').disable();
    this.suspensionForm.get('statut_contrat').disable();
    this.suspensionForm.get('point_emplacement').disable();
  }

    /*@@@@@@@@@@@@@@@@@@@@@@Formule Data Forms Controls @@@@@@@@@@@@@@@@@@@*/

    public GetAllFormules(): void {
      this.settingService
        .GetAllFormules({})
        .subscribe({
          next: (response) => {
            this.listFormules = response['data'];          
          },
          error: (error) => {
            this.toastrService.error(error.error.message);
          }
        })
     }
      OnInitFormuleForm() {
        this.formuleForm = this.fb.group({
          imsi: [''],
          msisdn: [''],
          formule: [''],
          statut_contrat: [''],
          justificatif: [''],
          point_emplacement: [''],
          formule_uuid: [''],
          description: [''],
          chg_formule_accepte: [''],
          chg_formule_accepte_comment: ['']
        })
      }
      OnShowFormuleForm() {
        this.formuleForm.get('imsi').patchValue(this.detailTransaction?.imsi);
        this.formuleForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
        this.formuleForm.get('formule').patchValue(this.detailTransaction?.formule);
        this.formuleForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
        this.formuleForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
        this.formuleForm.get('formule_uuid').patchValue(this.detailTransaction?.formule_uuid);
        this.formuleForm.get('description').patchValue(this.detailTransaction?.description);
        this.formuleForm.get('chg_formule_accepte').patchValue(this.detailTransaction?.rapport?.chg_formule_accepte);
        this.formuleForm.get('chg_formule_accepte_comment').patchValue(this.detailTransaction?.rapport?.chg_formule_accepte_comment);
        this.formuleForm.get('msisdn').disable();
        this.formuleForm.get('imsi').disable();
        this.formuleForm.get('formule').disable();
        this.formuleForm.get('statut_contrat').disable();
        this.formuleForm.get('point_emplacement').disable();
      }

  /*@@@@@@@@@@@@@@@@@@@ Activation Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitActivationForm() {
    this.activationForm = this.fb.group({
      bac_a_pioche: [''],
      niveau_un_uuid: [''],
      niveau_deux_uuid: [''],
      niveau_trois_uuid: [''],
      usage_id: [''],
      point_emplacement: [''],
      adresse_email: [''],
      adresse_geographique: [''],
      latitude: [''],
      longitude: [''],
      niveau_1: [''],
      niveau_2: [''],
      niveau_3: [''],
      usage: [''],
      imsi: [''],
      msisdn: [''],
      statut_contrat: [''],
      code_pin: [''],
      email: [''],
      description: [''],
      justificatif: [''],
      activation_accepte: [''],
      activation_accepte_comment: [''],
    })
  }
  OnShowActivationForm() {
    this.activationForm.get('bac_a_pioche').patchValue(this.detailTransaction?.bac_a_pioche);
    this.activationForm.get('niveau_un_uuid').patchValue(this.detailTransaction?.niveau_un_uuid);
    this.activationForm.get('niveau_deux_uuid').patchValue(this.detailTransaction?.niveau_deux_uuid);
    this.activationForm.get('niveau_trois_uuid').patchValue(this.detailTransaction?.niveau_trois_uuid);
    this.activationForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.activationForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.activationForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.activationForm.get('code_pin').patchValue(this.detailTransaction?.code_pin);
    this.activationForm.get('usage_id').patchValue(this.detailTransaction?.usage_id);
    this.activationForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.activationForm.get('adresse_email').patchValue(this.detailTransaction?.adresse_email);
    this.activationForm.get('adresse_geographique').patchValue(this.detailTransaction?.adresse_geographique);
    this.activationForm.get('latitude').patchValue(this.detailTransaction?.latitude);
    this.activationForm.get('longitude').patchValue(this.detailTransaction?.longitude);
    this.activationForm.get('description').patchValue(this.detailTransaction?.description);
    this.activationForm.get('activation_accepte').patchValue(this.detailTransaction?.rapport?.activation_accepte);
    this.activationForm.get('activation_accepte_comment').patchValue(this.detailTransaction?.rapport?.activation_accepte_comment);
    this.activationForm.get('msisdn').disable();
    this.activationForm.get('imsi').disable();
    this.activationForm.get('statut_contrat').disable();
    this.activationForm.get('code_pin').disable();
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
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listFirstLevel = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onGetDrValueChanges() {    
    return this.activationForm.get('niveau_un_uuid').valueChanges.subscribe((value) => {
      this.getAllExploitation(value);
    });
  }
  public getAllExploitation(data: string) {
    this.settingService
      .GetAllSecondLevelSimple({
        niveau_un_uuid: data,
      }).subscribe(
        (response: any) => {
          this.listSecondLevel = response['data'];
        },
        (error) => {
          this.toastrService.error(error.error.message);
        }
      )
  }
  public GetThirdLevel(): void {
    this.settingService
      .GetAllThirdSimple({})
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
      }case OperationTransaction.SUSPENSION: {
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
      this.transaction?.operation === OperationTransaction.CHANGEMENT_FORMULE ||
      this.transaction?.operation === OperationTransaction.SWAP ||
      this.transaction?.operation === OperationTransaction.VOLUME_DATA 
    ) ? true : false
  }
  public isAccepteForms(): boolean {
    return (
      this.detailTransaction?.rapport?.provisionning_accepte === 'oui' ||
      this.detailTransaction?.rapport?.volume_data_accepte === 'oui' ||
      this.detailTransaction?.rapport?.swap_accepte === 'oui' ||
      this.detailTransaction?.rapport?.suspension_accepte === 'oui' ||
      this.detailTransaction?.rapport?.chg_formule_accepte === 'oui' ||
      this.detailTransaction?.rapport?.resiliation_accepte === 'oui' ||
      this.detailTransaction?.rapport?.activation_accepte === 'oui'
    ) ? false : true
  }


  public IsTraitement(): string {
    if (!this.isAccepteForms()) {
       return TraitementTransaction.ACCEPTER
    }else if (this.isAccepteForms()){
      return TraitementTransaction.REJETER
    }else{
      return ""
    }
  }
  public ShowAcceptedForm(): boolean {
    return (this.transaction?.statut === StatutTransaction.TARITER || (this.transaction?.statut === StatutTransaction.CLOTURER && this.transaction?.traitement !== TraitementTransaction.ABANDONNER)) ? true : false
  }
  public IsProvisionningTransaction(): boolean {
    return (
      this.transaction?.operation === OperationTransaction.PROVISIONNING) ? true : false
  }
  public IsAchatTransaction(): boolean {
    return (
      this.transaction?.operation === OperationTransaction.ACHAT_SERVICE) ? true : false
  }
  public IsCancel(): boolean {
    return ((this.transaction?.statut === StatutTransaction.SOUMIS && (this.transaction?.traitement === TraitementTransaction.EN_ENTENTE))) ? true : false
  }
  public IsUpdate(): boolean {
    return ((this.transaction?.statut === StatutTransaction.SOUMIS && (this.transaction?.traitement === TraitementTransaction.EN_ENTENTE))
      || (this.transaction?.statut === StatutTransaction.TARITER && this.transaction?.traitement === TraitementTransaction.REJETER)
    ) ? true : false
  }
  IsReject() {
    return (this.transaction?.statut === StatutTransaction.TARITER && this.transaction?.traitement === TraitementTransaction.REJETER) ? true : false
  }
  public IsCloture(): boolean {
    return (((this.transaction?.statut === StatutTransaction.TARITER && this.transaction?.traitement === TraitementTransaction.ACCEPTER))) ? true : false
  }
  public IsShow(): boolean {
    return (this.transaction?.statut === StatutTransaction.CLOTURER || this.transaction?.traitement === TraitementTransaction.ACQUITER) ? true : false
  }
  public IsNotMessage(): boolean {
    return (this.transaction?.statut === StatutTransaction.TARITER || this.transaction?.statut === StatutTransaction.CLOTURER ||  this.transaction?.traitement === TraitementTransaction.ACQUITER) ? true : false
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
        }if (this.transaction?.operation === OperationTransaction.SWAP) {
          this.swapForm.patchValue({
            justificatif: this.currentFile,
          })
        }
        else if (this.transaction?.operation === OperationTransaction.ACTIVATION) {
          this.activationForm.patchValue({
            justificatif: this.currentFile
          })
        }else if (this.transaction?.operation === OperationTransaction.SUSPENSION) {
          this.suspensionForm.patchValue({
            justificatif: this.currentFile,
          })
        } else if (this.transaction?.operation === OperationTransaction.CHANGEMENT_FORMULE) {
          this.formuleForm.patchValue({
            justificatif: this.currentFile,
          })
        }else if (this.transaction?.operation === OperationTransaction.PROVISIONNING) {
          this.ligneForm.patchValue({
            justificatif: this.currentFile,
          })
        }else if (this.transaction?.operation === OperationTransaction.VOLUME_DATA) {
          this.volumeForm.patchValue({
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
                        this.transaction?.operation === OperationTransaction.CHANGEMENT_FORMULE
                        ? this.formuleForm.value :
                        this.transaction?.operation === OperationTransaction.ACTIVATION
                          ? this.activationForm.value :
                          this.achatForm.value
          ),
          transaction: this.transaction?.transaction,
          operation: this.transaction.operation,
         // model_id: this.transaction.model_id
        }
        this.supervisionOperationService
          .OnUpdateTransaction((
             this.transaction?.operation === OperationTransaction.VOLUME_DATA || 
             this.transaction?.operation === OperationTransaction.SWAP  || 
             this.transaction?.operation === OperationTransaction.RESILIATION || 
             this.transaction?.operation === OperationTransaction.SUSPENSION || 
             this.transaction?.operation === OperationTransaction.CHANGEMENT_FORMULE || 
             this.transaction?.operation === OperationTransaction.PROVISIONNING || 
             this.transaction?.operation === OperationTransaction.ACTIVATION) ? formDataBuilder(data) : data)
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
              this.transaction?.operation === OperationTransaction.CHANGEMENT_FORMULE ? {chg_formule_cloture: this.selectedIsCloture} :
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
    this.activeModal.close();
  }
}
