import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
// @ts-ignore
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { Justificatif } from 'src/shared/enum/Justificatif.enum';
import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { EnvService } from '../../../../../shared/services/env.service';

@Component({
  selector: 'app-commande-show',
  templateUrl: './commande-show.component.html',
  styleUrls: ['./commande-show.component.scss']
})
export class CommandeShowComponent implements OnInit {

  @Input() transaction;
  @Output() resultTraitement = new EventEmitter();
  public detailTransaction: any;
  public fileUrl: string;
  public filterTab: string;
  public OperationAchat: string = OperationTransaction.ACHAT_SERVICE
  public listTypeJustificatif: Array<any> = [];
  //Services Forms
  public adminForm: FormGroup;
  public achatForm: FormGroup;
  public isError: boolean = false;
  public currentSheetFormValidate: boolean = false;
  public currentData: any;
  public currentVolP: any;
  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private envService: EnvService,
    private supervisionOperationService: SupervisionOperationService,
    private provisionningService: ProvisionningService
  ) {
    Object.values(Justificatif).forEach(item => {
      this.listTypeJustificatif.push(item);
    });

    this.fileUrl = this.envService.fileUrl;
  }

  ngOnInit() {
    this.filterItem("first-item");
    this.GetDetailTransaction()
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
          this.OnShowAchatForm();
          this.currentVolP = this.detailTransaction?.detail_commande.filter(item => {
            return item.code_produit === 'VOL-P'
          });
          this.achatForm.disable();
        },
        error: (error) => {
          this.GetAllAchats();
          this.isError = true;
          this.toastrService.error(error.message);
        }
      })
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
    this.GetAllAchats()
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
        this.transaction?.operation === OperationTransaction.ACTIVATION ||
        this.transaction?.operation === OperationTransaction.RESILIATION ||
        this.transaction?.operation === OperationTransaction.SUSPENSION ||
        this.transaction?.operation === OperationTransaction.SWAP ||
        this.transaction?.operation === OperationTransaction.VOLUME_DATA
    )
  }
  public IsProvisionningTransaction(): boolean {
    return (
        this.transaction?.operation === OperationTransaction.PROVISIONNING)
  }
  public IsAchatTransaction(): boolean {
    return (
        this.transaction?.operation === OperationTransaction.ACHAT_SERVICE)
  }

  public IsShow(): boolean {
    return (this.transaction?.statut === StatutTransaction.CLOTURER)
  }
  public IsEmptySheeetForm(): boolean {
    if (this.transaction.operation === OperationTransaction.ACHAT_SERVICE) {
      return (!this.currentSheetFormValidate)
    }
  }
  public isAccepteForms(): boolean {
    return (!(this.detailTransaction?.rapport?.provisionning_accepte === 'oui' ||
        this.detailTransaction?.rapport?.volume_data_accepte === 'oui' ||
        this.detailTransaction?.rapport?.swap_accepte === 'oui' ||
        this.detailTransaction?.rapport?.suspension_accepte === 'oui' ||
        this.detailTransaction?.rapport?.resiliation_accepte === 'oui' ||
        this.detailTransaction?.rapport?.activation_accepte === 'oui' ||
        this.detailTransaction?.rapport?.commmande_produit_accepte === 'oui'))
  }

}
