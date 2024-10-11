import { SUIVIE_TRAITEMENT_ROUTE, CONTENCIEUX_ROUTE, DEMANDE_ROUTE } from './../../../presentation/pages/supervision-operations/supervision-operations-routing.module';
import { TraitementTransaction } from '../../enum/TraitementTransaction.enum';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { OPERATION_PROVISIONNING, PATRIMOINE, SUPERVISION_OPERATIONS } from 'src/shared/routes/routes';
import { COMMANDE_SIM, LIGNE_CREDIT } from 'src/presentation/pages/provisionning/provisionning-routing.module';
import { ProvisionningService } from 'src/presentation/pages/provisionning/data-access/provisionning.service';
import { handle } from 'src/shared/functions/api.function';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ListCommuneService } from 'src/shared/services/list-commune.service';
@Component({
  selector: 'app-transaction-show',
  templateUrl: './transaction-show.component.html',
  styleUrls: ['./transaction-show.component.scss']
})
export class TransactionShowComponent implements OnInit {

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
  public operationIntegration: string = OperationTransaction.INTEGRATION;
  public operationIdentification : string = OperationTransaction.IDENTIFICATION
  public operationSwap: string = OperationTransaction.SWAP
  public OperationResiliation: string = OperationTransaction.RESILIATION
  public OperationSuspension: string = OperationTransaction.SUSPENSION
  public OperationFormule: string = OperationTransaction.CHANGEMENT_FORMULE
  public OperationVolumeData: string = OperationTransaction.VOLUME_DATA
  public OperationAchat: string = OperationTransaction.ACHAT_SERVICE
  public listTypeJustificatif: Array<any> = [];
  public listFirstLevel: Array<any> = [];
  public listSecondLevel: Array<any> = [];
  public listThirdLevel: Array<any> = [];
  public listUsages: Array<any> = [];
  public listFormules: Array<any> = [];

  //Services Forms
  public ligneForm: FormGroup;
  public volumeForm: FormGroup;
  public swapForm: FormGroup;
  public resiliationForm: FormGroup;
  public suspensionForm: FormGroup;
  public formuleForm: FormGroup;
  public activationForm: FormGroup;
  public integrationForm: FormGroup;
  public adminForm: FormGroup;
  public achatForm: FormGroup;
  public currentFile: any;
  public sourceStockTenantSim: string;
  public sourceStockOrangeSim: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public sourceSoldeDotation: string
  public sourceSoldeDotationOrange: string
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;


  constructor(
    private listCommuneService: ListCommuneService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService,
    private provisionningService: ProvisionningService,
    private router: Router,
    private loadingBarService: LoadingBarService
  ) {
    Object.values(Justificatif).forEach(item => {
      this.listTypeJustificatif.push(item);
    });
    this.fileUrl = this.mappingService.fileUrl;
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.sourceStockTenantSim = this.mappingService.sourceStockTenantSim,
      this.sourceStockOrangeSim = this.mappingService.sourceStockOrangeSim,
      this.sourceSoldeDotation = this.mappingService.sourceSoldeDotation,
      this.sourceSoldeDotationOrange = this.mappingService.sourceSoldeDotationOrange
  }

  ngOnInit() {
    this.filterItem("first-item");
    this.GetDetailTransaction();
    this.OnInitLigneForm();
    this.OnInitVolumeForm();
    this.OnInitSwapForm();
    this.OnInitResiliationForm();
    this.OnInitSuspensionForm();
    this.OnInitFormuleForm()
    this.OnInitActivationForm();
    this.OnInitIntegrationForm();
    this.OnInitAchatForm();
    this.isAccepteForms();
    this.IsTraitement()
    this.IsCancel();
    this.IsUpdate();
    this.IsCloture();
    this.IsReject();
    this.IsShow();
    this.IsJustificatif()
    this.IsEmptyPanier()
    this.IsVerify();
    this.IsContentSim()
    this.ShowAcceptedForm()
    this.IsProvisionningTransaction()
    this.IsAchatTransaction()
    this.IscurrentDate()
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
          } else if (this.detailTransaction?.operation === OperationTransaction.CHANGEMENT_FORMULE) {
            this.GetAllFormules()
            this.OnShowFormuleForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACTIVATION ||
            this.detailTransaction?.operation === OperationTransaction.INTEGRATION
          ) {
            this.GetAllFirstLevel();
            this.GetThirdLevel();
            this.GetAllUsages();
            this.OnShowActivationForm();
            this.OnShowIntegrationForm();
          } else if (this.detailTransaction?.operation === OperationTransaction.ACHAT_SERVICE) {
            this.OnShowAchatForm();
          }
          this.activationForm.disable();
          this.integrationForm.disable();
          this.ligneForm.disable();
          this.volumeForm.disable();
          this.swapForm.disable();
          this.resiliationForm.disable();
          this.suspensionForm.disable();
          this.formuleForm.disable();
          this.IsLoading.emit(false);
        },
        error: (error) => {
          this.handleCloseModal();
          this.IsLoading.emit(false);
          this.toastrService.error(error.error.message);
        }
      })
  }

  public truncateText(text: string, length: number): string {
    if (!text || text.length > length) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}


  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public GetCurrentMessage(operation): string {
    switch (operation) {
      case OperationTransaction.ACTIVATION: {
        return this.activationForm.get('activation_accepte_comment').value;
      }
      case OperationTransaction.INTEGRATION: {
        return this.integrationForm.get('integration_accepte_comment').value;
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

  OnFeebackTransaction() {
    if (this.router.url === `/${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`) {
      return this.GetAllTraitement()
    } else if (this.router.url === `/${SUPERVISION_OPERATIONS}/${CONTENCIEUX_ROUTE}`) {
      return this.GetAllContencieux()
    } else if (this.router.url === `/${PATRIMOINE}/${''}`) {
      return this.GetAllTransactions()
    } else if (this.router.url === `/${SUPERVISION_OPERATIONS}/${DEMANDE_ROUTE}`) {
      return this.GetAllDemandes()
    } else if (this.router.url === `/${OPERATION_PROVISIONNING}/${COMMANDE_SIM}`) {
      return this.GetAllAchats()
    } else if (this.router.url === `/${OPERATION_PROVISIONNING}/${LIGNE_CREDIT}`) {
      return this.GetAllLigneCredits()
    } else if (this.router.url === `/${SUPERVISION_OPERATIONS}/${LIGNE_CREDIT}`) {
      return this.GetAllLigneCredits()
    }
  }
  public GetAllTraitement() {
    this.supervisionOperationService
      .GetAllTransactions({}, 1)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return { ...data, current_date: data?.date_traitement }
            } else if (data?.statut === StatutTransaction.CLOTURER) {
              return { ...data, current_date: data?.date_cloture }
            } else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return { ...data, current_date: data?.date_acquittement }
            } else {
              return { ...data, current_date: 'N/A' }
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
  public GetAllTransactions() {
    this.patrimoineService
      .GetAllTransactions({}, 1)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return { ...data, current_date: data?.date_traitement }
            } else if (data?.statut === StatutTransaction.CLOTURER) {
              return { ...data, current_date: data?.date_cloture }
            } else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return { ...data, current_date: data?.date_acquittement }
            } else {
              return { ...data, current_date: 'N/A' }
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
  public GetAllDemandes() {
    this.patrimoineService
      .GetAllTransactions({
        statut: StatutTransaction.SOUMIS,
        traitement: TraitementTransaction.EN_ENTENTE
      }, 1)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response['data']['data'];
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
          this.listTraitemants = response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return { ...data, current_date: data?.date_traitement }
            } else if (data?.statut === StatutTransaction.CLOTURER) {
              return { ...data, current_date: data?.date_cloture }
            } else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return { ...data, current_date: data?.date_acquittement }
            } else {
              return { ...data, current_date: 'N/A' }
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

  public OnGetRapportCodeStyle(code: any): string {
    if (code.includes('100')) {
      return 'style100';
    } else if (code.includes('200')) {
      return 'style200';
    } else {
      return 'styledefault';
    }
  }

  public GetAllAchats() {
    this.provisionningService
      .GetAllAchats({}, 1)
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
  public GetAllLigneCredits() {
    this.provisionningService
      .GetAllLigneCredits({}, 1)
      .subscribe({
        next: (response) => {
          this.resultTraitement.emit(response['data']['data']);
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
  public pipeValue(detailTransaction: any, propiete: "montant_formule") {
    if(propiete === "montant_formule") {
      const formatFCA= (new Intl.NumberFormat('fr-FR').format(detailTransaction?.["montant_formule"])+" CFA");
     return formatFCA; 
    }
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
    } else {
      window.open(this.fileUrl + this.detailTransaction?.justificatif)
    }
  }
  IsJustificatif(): boolean {
    return (this.detailTransaction?.justificatif) ? true : false
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Volume Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitVolumeForm() {
    this.volumeForm = this.fb.group({
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
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
    this.volumeForm.get('statut_contrat').disable();
  }
  get sourceStock() {
    return this.volumeForm.get('bac_a_pioche').value;
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Swap Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitSwapForm() {
    this.swapForm = this.fb.group({
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      statut_contrat: [''],
      point_emplacement: [''],
      bac_a_pioche: [''],
      description: [''],
      swap_accepte: [''],
      swap_accepte_comment: ['']
    })
    this.swapForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.swapForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.swapForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.swapForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
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
  }
  get sourceStockSwap() {
    return this.swapForm.get('bac_a_pioche').value;
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Resiliation Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitResiliationForm() {
    this.resiliationForm = this.fb.group({
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      statut_contrat: [''],
      justificatif: [''],
      point_emplacement: [''],
      description: [''],
      resiliation_accepte: [''],
      resiliation_accepte_comment: ['']
    })
    this.resiliationForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.resiliationForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.resiliationForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.resiliationForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
  }
  OnShowResiliationForm() {
    this.resiliationForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.resiliationForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.resiliationForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.resiliationForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.resiliationForm.get('description').patchValue(this.detailTransaction?.description);
    this.resiliationForm.get('resiliation_accepte').patchValue(this.detailTransaction?.rapport?.resiliation_accepte);
    this.resiliationForm.get('resiliation_accepte_comment').patchValue(this.detailTransaction?.rapport?.resiliation_accepte_comment);
  }

  public onChangeFile(file: FileList) {
    this.currentFile = file.item(0);
  }
  /*@@@@@@@@@@@@@@@@@@@@@@Suspension Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitSuspensionForm() {
    this.suspensionForm = this.fb.group({
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      statut_contrat: [''],
      justificatif: [''],
      point_emplacement: [''],
      description: [''],
      suspension_accepte: [''],
      suspension_accepte_comment: ['']
    })
    this.suspensionForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.suspensionForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.suspensionForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.suspensionForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
  }
  OnShowSuspensionForm() {
    this.suspensionForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.suspensionForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.suspensionForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.suspensionForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.suspensionForm.get('description').patchValue(this.detailTransaction?.description);
    this.suspensionForm.get('suspension_accepte').patchValue(this.detailTransaction?.rapport?.suspension_accepte);
    this.suspensionForm.get('suspension_accepte_comment').patchValue(this.detailTransaction?.rapport?.suspension_accepte_comment);
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
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      formule: [''],
      montant_formule: [''],
      statut_contrat: [''],
      justificatif: [''],
      point_emplacement: [''],
      formule_uuid: [''],
      description: [''],
      chg_formule_accepte: [''],
      chg_formule_accepte_comment: ['']
    })
    this.formuleForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.formuleForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.formuleForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.formuleForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
  }
  OnShowFormuleForm() {
    this.formuleForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.formuleForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.formuleForm.get('formule').patchValue(this.detailTransaction?.formule);
    this.formuleForm.get('montant_formule').patchValue(this.detailTransaction?.montant_formule);
    this.formuleForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.formuleForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.formuleForm.get('formule_uuid').patchValue(this.detailTransaction?.formule_uuid);
    this.formuleForm.get('description').patchValue(this.detailTransaction?.description);
    this.formuleForm.get('chg_formule_accepte').patchValue(this.detailTransaction?.rapport?.chg_formule_accepte);
    this.formuleForm.get('chg_formule_accepte_comment').patchValue(this.detailTransaction?.rapport?.chg_formule_accepte_comment);
  }
  /*@@@@@@@@@@@@@@@@@@@ Integration Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitIntegrationForm() {
    this.integrationForm = this.fb.group({
      niveau_un_uuid: [this.createFormControl(null, Validators.required, true)],
      niveau_deux_uuid: [this.createFormControl(null, Validators.required, true)],
      niveau_trois_uuid: [this.createFormControl(null, Validators.required, true)],
      usage_id: [this.createFormControl(null, Validators.required, true)],
      iccid: [this.createFormControl(null, Validators.required, true)],
      point_emplacement: [this.createFormControl(null, Validators.required, true)],
      adresse_email: [this.createFormControl(null, Validators.required, true)],
      adresse_geographique: [this.createFormControl(null, Validators.required, true)],
      latitude: [this.createFormControl(null, Validators.required, true)],
      longitude: [this.createFormControl(null, Validators.required, true)],
      niveau_1: [this.createFormControl(null, Validators.required, true)],
      niveau_2: [this.createFormControl(null, Validators.required, true)],
      niveau_3: [this.createFormControl(null, Validators.required, true)],
      usage: [this.createFormControl(null, Validators.required, true)],
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      montant_formule: [this.createFormControl(null, Validators.required, true)],
      statut_contrat: [this.createFormControl(null, Validators.required, true)],
      formule: [this.createFormControl(null, Validators.required, true)],
      formule_uuid: [this.createFormControl(null, Validators.required, true)],
      code_pin: [this.createFormControl(null, Validators.required, true)],
      email: [this.createFormControl(null, Validators.required, true)],
      description: [this.createFormControl(null, Validators.required, true)],
      integration_accepte: [this.createFormControl(null, Validators.required, true)],
      integration_accepte_comment: [this.createFormControl(null, Validators.required, true)],
    })
    this.integrationForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.integrationForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.integrationForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.integrationForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
  }
  private createFormControl(initialValue: any = null, validator: any = null, isDisabled: boolean = false): any {
      return [{ value: initialValue, disabled: isDisabled }, validator].filter(v => v !== null);
  }
  OnShowIntegrationForm() {
    this.integrationForm.patchValue({
      niveau_un_uuid: [this.detailTransaction?.niveau_un_uuid],
      niveau_deux_uuid: [this.detailTransaction?.niveau_deux_uuid],
      niveau_trois_uuid: [this.detailTransaction?.niveau_trois_uuid],
      usage_id: [this.detailTransaction?.usage_id],
      point_emplacement: [this.detailTransaction?.point_emplacement],
      adresse_email: [this.detailTransaction?.adresse_email],
      adresse_geographique: [this.detailTransaction?.adresse_geographique],
      latitude: [this.detailTransaction?.latitude],
      longitude: [this.detailTransaction?.longitude],
      niveau_1: [this.detailTransaction?.niveau_1],
      niveau_2: [this.detailTransaction?.niveau_2],
      niveau_3: [this.detailTransaction?.niveau_3],
      usage: [this.detailTransaction?.usage],
      imsi: [this.detailTransaction?.imsi],
      msisdn: [this.detailTransaction?.msisdn],
      montant_formule: [this.pipeValue(this.detailTransaction, "montant_formule")],
      iccid: [this.detailTransaction?.iccid],
      statut_contrat: [this.detailTransaction?.statut_contrat],
      formule: [this.detailTransaction?.formule],
      formule_uuid: [this.detailTransaction?.formule_uuid],
      code_pin: [this.detailTransaction?.code_pin],
      email: [this.detailTransaction?.email],
      description: [this.detailTransaction?.description],
      integration_accepte: [this.detailTransaction?.integration_accepte],
      integration_accepte_comment: [this.detailTransaction?.integration_accepte_comment],
    })
  }
  /*@@@@@@@@@@@@@@@@@@@ Activation Form Controls @@@@@@@@@@@@@@@@@*/
  OnInitActivationForm() {
    this.activationForm = this.fb.group({
      bac_a_pioche: ["true"],
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
      iccid: [''],
      apn: [''],
      adresse_ip: [''],
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      statut_contrat: [''],
      formule: [''],
      formule_uuid: [''],
      code_pin: [''],
      email: [''],
      description: [''],
      activation_accepte: [''],
      activation_accepte_comment: [''],
    })
    this.activationForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.activationForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.activationForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.activationForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
  }

  OnShowActivationForm() {
    this.activationForm.get('bac_a_pioche').patchValue('true');
    this.activationForm.get('niveau_un_uuid').patchValue(this.detailTransaction?.niveau_un_uuid);
    this.activationForm.get('niveau_deux_uuid').patchValue(this.detailTransaction?.niveau_deux_uuid);
    this.activationForm.get('niveau_trois_uuid').patchValue(this.detailTransaction?.niveau_trois_uuid);
    this.activationForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.activationForm.get('iccid').patchValue(this.detailTransaction?.iccid);
    this.activationForm.get('apn').patchValue(this.detailTransaction?.apn);
    this.activationForm.get('adresse_ip').patchValue(this.detailTransaction?.adresse_ip);
    this.activationForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.activationForm.get('formule').patchValue(this.detailTransaction?.formule);
    this.activationForm.get('formule_uuid').patchValue(this.detailTransaction?.formule_uuid);
    this.activationForm.get('statut_contrat').patchValue(this.detailTransaction?.statut_contrat);
    this.activationForm.get('code_pin').patchValue(this.detailTransaction?.code_pin);
    this.activationForm.get('usage_id').patchValue(this.detailTransaction?.usage_id);
    this.activationForm.get('point_emplacement').patchValue(this.detailTransaction?.point_emplacement);
    this.activationForm.get('adresse_email').patchValue(this.detailTransaction?.adresse_email);
    this.activationForm.get('adresse_geographique').patchValue(this.detailTransaction?.adresse_geographique);
    this.activationForm.get('latitude').patchValue(this.detailTransaction?.latitude);
    this.activationForm.get('description').patchValue(this.detailTransaction?.description);
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



  async GetAllFirstLevel() {
    const response: any = await handle(() => this.settingService.GetAllFirstLevelSimple({}), this.toastrService, this.loadingBarService);
    if (response?.data) this.handleSuccessfulFirstLevel(response);
  }

  private handleSuccessfulFirstLevel(response): void {
      this.listFirstLevel = response['data'].map((element) => { return { ...element, fullName: `${element.nom}` } });
  }

  public onChangeFirstLvel(uuid: any) {
      this.listSecondLevel = [];
      this.listFirstLevel.find((element) => {
          if (element.uuid === uuid)  this.listSecondLevel = this.listCommuneService.getListCommune(element);
      });
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
      case OperationTransaction.INTEGRATION: {
        return "Integration de SIM";
      }
      case OperationTransaction.IDENTIFICATION: {
        return "Identification de SIM";
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
      this.transaction?.operation === OperationTransaction.ACTIVATION ||
      this.transaction?.operation === OperationTransaction.IDENTIFICATION  ||
      this.transaction?.operation === OperationTransaction.INTEGRATION ||
      this.transaction?.operation === OperationTransaction.RESILIATION ||
      this.transaction?.operation === OperationTransaction.SUSPENSION ||
      this.transaction?.operation === OperationTransaction.SWAP ||
      this.transaction?.operation === OperationTransaction.VOLUME_DATA
    ) ? true : false
  }
  public ShowAcceptedForm(): boolean {
    return (this.transaction?.statut === StatutTransaction.TARITER || (this.transaction?.statut === StatutTransaction.CLOTURER && this.transaction?.traitement !== TraitementTransaction.ABANDONNER)) ? true : false
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
    } else if (this.isAccepteForms()) {
      return TraitementTransaction.REJETER
    } else {
      return ""
    }
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
    } else if (this.transaction?.statut === StatutTransaction.CLOTURER) {
      return this.detailTransaction?.rapport?.date_cloture
    } else if ((this.transaction?.traitement === StatutTransaction.SOUMIS) && (this.transaction?.traitement === TraitementTransaction.ACQUITER)) {
      return this.detailTransaction?.rapport?.date_acquittement
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

//this.baseUrl = this.envService.apiUrl;
