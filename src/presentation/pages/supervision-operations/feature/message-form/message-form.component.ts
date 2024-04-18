import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { formDataBuilder } from 'src/shared/constants/formDataBuilder.constant';
import { SujetEnum } from '../../data-access/sujet.enum';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;
  currentFile: any;
  public sourceValue: string;
  public sourceOffreCommercial: string = SujetEnum.OFRRE_COMMERCIAL
  public sourceContrat: string = SujetEnum.CONTRAT
  public sourceFacture: string = SujetEnum.FACTURE

  constructor(
    private fb: FormBuilder,
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private mappingService: MappingService
  ) { }

  ngOnInit() {   
    this.initForm()
    if (!this.currentObject) {
      this.adminForm.get('signature_nom').patchValue(this.mappingService.currentUser?.nom);
      this.adminForm.get('signature_contact').patchValue(this.mappingService.currentUser?.contacts);
      this.adminForm.get('signature_fonction').patchValue(this.mappingService.profil?.nom);    
    }else{
      this.adminForm.get('sujet').patchValue(this.currentObject?.sujet);
      this.adminForm.get('objet').patchValue(this.currentObject?.objet);
      this.adminForm.get('message').patchValue(this.currentObject?.message);
      this.adminForm.get('signature_nom').patchValue(this.currentObject?.signature_nom);
      this.adminForm.get('signature_fonction').patchValue(this.currentObject?.signature_fonction);
      this.adminForm.get('signature_contact').patchValue(this.currentObject?.signature_contact);
      this.adminForm.get('sujet').disable();
    }    
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public initForm() {
    this.adminForm = this.fb.group({
      sujet: ['',[Validators.required]],
      objet: ['',[Validators.required]],
      message: ['',[Validators.required]],
      signature_nom: ['',[Validators.required]],
      signature_fonction: ['',[Validators.required]],
      signature_contact: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      piece_jointe: ['']
    })
    this.adminForm.get('signature_contact').valueChanges.subscribe(value => {
      if (value && value.length > 10) {
        this.adminForm.get('signature_contact').setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
  }
  handleSave(){    
    this.adminForm.patchValue({
      piece_jointe: this.currentFile
    })
    this.supervisionOperationService
      .HandleSaveMessage(formDataBuilder(this.adminForm.value)).subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.close()
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  handleUpdate(){    
    this.adminForm.patchValue({
      piece_jointe: this.currentFile
    })
    this.supervisionOperationService
      .HandleUpdateMessage(formDataBuilder({
        ...this.adminForm.value,
        message_id: this.currentObject?.id
      })).subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.close()
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  
  public OnChangeFile(file: FileList) {
    this.currentFile = file.item(0);    
  }
}
