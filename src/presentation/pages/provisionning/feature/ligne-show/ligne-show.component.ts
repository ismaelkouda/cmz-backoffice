import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
// @ts-ignore
import appConfig from '../../../../../assets/config/app-config.json';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { Justificatif } from 'src/shared/enum/Justificatif.enum';
import { ProvisionningService } from '../../data-access/provisionning.service';

@Component({
  selector: 'app-ligne-show',
  templateUrl: './ligne-show.component.html',
  styleUrls: ['./ligne-show.component.scss']
})
export class LigneShowComponent implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService,
    private provisionningService: ProvisionningService
  ) {
    Object.values(Justificatif).forEach(item => {
      this.listTypeJustificatif.push(item);
    });
  }

  ngOnInit() {
    this.filterItem("first-item");
    this.GetDetailTransaction();
    this.OnInitLigneForm();
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
          this.OnShowLigneForm()
          this.ligneForm.disable();
        },
        error: (error) => {
          this.GetAllLigneCredits();
          this.isError = true;
          this.toastrService.error(error.message);
        }
      })
  }

  public GetAllLigneCredits() {
    this.provisionningService
      .GetAllLigneCredits({}, 1)
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
          window.open(this.detailTransaction?.justificatif)
    }
  }
  downloadModal() {
    window.open('../../../../../assets/data/format_cmd.xlsx')
  }

  public handleCloseModal(): void {
    this.GetAllLigneCredits()
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

}