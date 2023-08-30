import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';

declare var require;
const Swal = require("sweetalert2");

@Component({
  selector: 'app-traitement-show',
  templateUrl: './traitement-show.component.html',
  styleUrls: ['./traitement-show.component.scss']
})
export class TraitementShowComponent implements OnInit {

  //Structure Organisationnelle
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;

  @Input() transaction;
  public filterTab: string;
  //Ligne Credit
  public operationLigneCredit: string = OperationTransaction.LIGNE_CREDIT;
  public creditForm: FormGroup;
  public listTypeJustificatif: Array<any> = [];
  public selectedJustificatif: any;
  // Activation
  public operationActivation: string = OperationTransaction.ACTIVATION
  public activationForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private mappingService: MappingService

  ) {
    this.listTypeJustificatif = ['email', 'bon commande', 'courier', 'autre'];
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.filterItem("first-item");
    this.OnInitCreditForm();
    console.log("this.transaction?.rapport?.code?.split('')", this.transaction?.rapport?.code.includes('100'));

  }
  public filterItem(status: string): string {
    this.filterTab = status;
    return this.filterTab
  }

  handleCloseModal(type: 'croix' | 'abandonner'): void {
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
      case this.operationLigneCredit: {
        return 'Ligne de Credit';
      }
      case this.operationActivation: {
        return "Activation de SIM";
      }
    }
  }

  public OnInitCreditForm() {
    this.creditForm = this.fb.group({
      operation: [''],
      montant: ['', [Validators.required]],
      type_justificatif: ['', [Validators.required]],
      justificatif: [''],
      description: ['', [Validators.required]],
      ligne_comment: ['']
    })
  }
  public onChangeFile(file: FileList) {
    this.selectedJustificatif = file.item(0);
  }

  public isAccepteForms(event: any, choice: string) {

  }

  public enregistrerForms() { }

}
