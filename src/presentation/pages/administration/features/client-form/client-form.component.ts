import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.iniForm()
  }

  public iniForm() {
    this.adminForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenoms: ['', [Validators.required]],
      email: ['', [Validators.required]],
      msisdn: ['', [Validators.required]]
    })
  }
  public close(): void {
    this.formsView.emit(false);
  }
}
