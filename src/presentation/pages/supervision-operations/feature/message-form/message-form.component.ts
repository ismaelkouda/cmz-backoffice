import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;
  selectedJustificatif: any;
  public sourceValue: string;
  public sourceOffreCommercial: string = 'Offre Commercial'
  public sourceContrat: string = 'Contrat'
  public sourceFacture: string = 'Facture'

  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.initForm()
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public initForm() {
    this.adminForm = this.fb.group({

    })
  }
  handleSave(){

  }
}
