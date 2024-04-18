import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { SujetEnum } from '../../data-access/sujet.enum';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-show-message-sender',
  templateUrl: './show-message-sender.component.html',
  styleUrls: ['./show-message-sender.component.scss']
})
export class ShowMessageSenderComponent implements OnInit {

  @Input() transaction;
  @Output() resultTraitement = new EventEmitter();
  public detailTransaction: any;
  public filterTab: string;
  public listTraitemants: Array<any> = [];
  public listTypeJustificatif: Array<any> = [];
  public regularType: string
  public adminForm: FormGroup;
  public sourceOffreCommercial: string = SujetEnum.OFRRE_COMMERCIAL
  public sourceContrat: string = SujetEnum.CONTRAT
  public sourceFacture: string = SujetEnum.FACTURE

  constructor(
    private fb: FormBuilder,
    private mappingService: MappingService,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private supervisionOperationService: SupervisionOperationService
  ) {}

  ngOnInit() {
    this.filterItem("first-item");
    this.OnInitForm();
    this.OnDetailMessageRecieve()   
    this.IsJustificatif() 
  }
  
 public GetAllMessagesRecieve() {
  this.supervisionOperationService
    .GetAllMessagesSender({
     tenant_code: this.transaction?.code,
    }, 1)
    .subscribe({
      next: (response) => {

      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    })
}
  public OnDetailMessageRecieve() {
    this.supervisionOperationService
      .OnDetailMessagesSender({
        message_id: this.transaction?.id          
      },)
      .subscribe({
        next: (response) => {
          this.detailTransaction = response['data'];
          this.OnShowForm()
          this.adminForm.disable();
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
  /*@@@@@@@@@@@@@@@@@@@ Ligne Form Controls @@@@@@@@@@@@@@@@@@@*/
  OnInitForm() {
    this.adminForm = this.fb.group({
      sujet: [''],
      objet: [''],
      message: [''],
      signature_nom: [''],
      signature_fonction: [''],
      signature_contact: [''],
      piece_jointe: [''],
    })
  }

  OnShowForm() {
    this.adminForm.get('sujet').patchValue(this.detailTransaction?.sujet);
    this.adminForm.get('objet').patchValue(this.detailTransaction?.objet);
    this.adminForm.get('message').patchValue(this.detailTransaction?.message);
    this.adminForm.get('signature_nom').patchValue(this.detailTransaction?.signature_nom);
    this.adminForm.get('signature_contact').patchValue(this.detailTransaction?.signature_contact);
    this.adminForm.get('signature_fonction').patchValue(this.detailTransaction?.signature_fonction);
    this.adminForm.get('piece_jointe').patchValue(this.detailTransaction?.piece_jointe);
  }
  get getSujet() {    
    return this.adminForm.get('sujet').value;
  }
  downloadFile() {
    window.open(`${this.mappingService.fileUrl}${this.detailTransaction.piece_jointe}`)
  }

  IsJustificatif(): boolean{
    return (this.detailTransaction?.piece_jointe) ? true : false
  }
  public handleCloseModal(): void {
    this.activeModal.close()
  }

}
