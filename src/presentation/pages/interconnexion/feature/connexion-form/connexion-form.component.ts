import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-connexion-form',
  templateUrl: './connexion-form.component.html',
  styleUrls: ['./connexion-form.component.scss']
})
export class ConnexionFormComponent implements OnInit {

  adminForm: FormGroup;
  @Input() currentObject;
  @Output() formsView = new EventEmitter();

  constructor(
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.initForm();
    if (this.currentObject !== undefined) {
      this.onFormPachValues();
    }
  }

  public initForm(): void {
    this.adminForm = this.fb.group({
      nom: [''],
      type_auth: [''],
      protocole: [''],
      ip_dns: [''],
      port: [''],
      description: [''],
    });
  }
  handleSaveConnexion() {

  }
  handleUpdateConnexion() {

  }
  close() {
    this.formsView.emit(false);
    this.adminForm.reset();
  }

  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject?.nom);
  }
}
