import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
// @ts-ignore
import appConfig from '../../../../../assets/config/app-config.json';
import { SettingService } from 'src/shared/services/setting.service';
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
  public fileUrl: string = appConfig.filUrl;
  public filterTab: string;
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

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService,
    private settingService: SettingService

  ) {
    this.listTypeJustificatif = ['document', 'email', 'bon commande', 'courier', 'autre'];
    this.listProducts = [
      {
        id: 1,
        nom: 'product A',
        prix: 1000,
        code: 'IMA-05A',
        qty: 30
      },
      {
        id: 2,
        nom: 'product B',
        prix: 20000,
        code: 'IMA-05B',
        qty: 50
      },
      {
        id: 3,
        nom: 'product C',
        prix: 5000,
        code: 'IMA-05C',
        qty: 40
      },
    ]
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
    this.isAccepteForms();
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
          }
        },
        error: (error) => {
          this.GetAllTransactions();
          this.isError = true;
          this.toastrService.error(error.message);
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
          this.toastrService.error(error.message);
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
    window.open(this.fileUrl + this.detailTransaction?.justificatif)
  }

  /*@@@@@@@@@@@@@@@@@@@@@@Volume Data Forms Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitVolumeForm() {
    this.volumeForm = this.fb.group({
      imsi: [''],
      msisdn: [''],
      statut: [''],
      beneficiaire: [null],
      bac_a_pioche: [''],
      volume: [''],
      volume_data_accepte: [''],
      volume_data_accepte_comment: ['', [Validators.required]]
    })
  }
  OnShowVolumeForm() {
    this.volumeForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.volumeForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.volumeForm.get('statut').patchValue(this.detailTransaction?.statut);
    this.volumeForm.get('beneficiaire').patchValue(this.detailTransaction?.beneficiaire);
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
      statut: [''],
      beneficiaire: [null],
      bac_a_pioche: [''],
      description: [''],
      swap_accepte: [''],
      swap_accepte_comment: ['']
    })
  }
  OnShowSwapForm() {
    this.swapForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.swapForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.swapForm.get('statut').patchValue(this.detailTransaction?.statut);
    this.swapForm.get('beneficiaire').patchValue(this.detailTransaction?.beneficiaire);
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
      statut: [''],
      beneficiaire: [null],
      description: [''],
      resiliation_accepte: [''],
      resiliation_accepte_comment: ['']
    })
  }
  OnShowResiliationForm() {
    this.resiliationForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.resiliationForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.resiliationForm.get('statut').patchValue(this.detailTransaction?.statut);
    this.resiliationForm.get('beneficiaire').patchValue(this.detailTransaction?.beneficiaire);
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
      statut: [''],
      beneficiaire: [null],
      description: [''],
      suspension_accepte: [''],
      suspension_accepte_comment: ['']
    })
  }
  OnShowSuspensionForm() {
    this.suspensionForm.get('imsi').patchValue(this.detailTransaction?.imsi);
    this.suspensionForm.get('msisdn').patchValue(this.detailTransaction?.msisdn);
    this.suspensionForm.get('statut').patchValue(this.detailTransaction?.statut);
    this.suspensionForm.get('beneficiaire').patchValue(this.detailTransaction?.beneficiaire);
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
      emplacement: [''],
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
    this.activationForm.get('niveau_1').patchValue({});
    this.activationForm.get('niveau_2').patchValue({});
    this.activationForm.get('niveau_3').patchValue({});
    this.activationForm.get('usage').patchValue({});
    this.activationForm.get('emplacement').patchValue('emplacement');
    this.activationForm.get('email').patchValue(this.detailTransaction?.email);
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
  OnInitLAchatForm() {
    this.achatForm = this.fb.group({
      produits: [''],
      statut: [''],
      commentaire: ['', [Validators.required]]
    })
  }
  OnShowAchatForm() {
    this.achatForm.get('produits').patchValue([]);
    this.achatForm.get('statut').patchValue('non');
    this.achatForm.get('commentaire').patchValue('Mon commentaire');
    this.achatForm.disable();
    this.achatForm.get('commentaire').enable();
    this.achatForm.get('statut').enable();
  }
  public handleCloseModal(type: 'croix' | 'abandonner'): void {
    switch (type) {
      case 'croix':
        this.activeModal.close();
        break;
      case 'abandonner':
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false,
        })
        swalWithBootstrapButtons.fire({
          title: 'En êtes vous sûr ?',
          html: `Vous allez Abandonner cette transaction`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Annuler',
          confirmButtonText: 'Oui'
        }).then((result) => {
          if (result.value) {
            // this.loadingBar.start();
            // const dataToSend = {
            //   transaction: this.transaction.transaction,
            //   ouvrage_id: this.transaction.ouvrage_id,
            // };
            // this.traitementService
            //   .getLetDownPointLumineux(dataToSend)
            //   .subscribe((data: {}) => {
            //     if (!this.response.error) {
            //       this.loadingBar.stop();
            //       this.sharedDataService.sendRefreshListTraitement();
            //     } else {
            //       this.loadingBar.stop();
            //       this.toastrService.error(this.response.message);
            //     }
            //   });
            this.activeModal.close();
          }
        });
        break;
    }
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
  public OnChangeTypeFilter(event) {

  }

  public onVerify() {

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
  OnSaveTransaction(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "En êtes vous sûr ?",
        html: `Les informations de traitement de la transaction <strong><u>${this.detailTransaction.rapport.transaction}</u></strong> seront enregistrées.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#569C5B',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.value) {
          const data = {
            ...(
              this.transaction?.operation === OperationTransaction.PROVISIONNING
                ? this.ligneForm.value :
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
            model_id: this.transaction.model_id,
            tenant_id: this.detailTransaction?.tenant_id
          }

          //console.log("data", data);
          this.supervisionOperationService
            .OnSaveTransaction(data)
            .subscribe({
              next: (response) => {
                this.toastrService.success(response.message);
                this.GetAllTransactions();
              },
              error: (error) => {
                this.toastrService.error(error.error.message);
              }
            })
        }
      });
  }

}
