import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms-profil',
  templateUrl: './forms-profil.component.html',
  styleUrls: ['./forms-profil.component.scss']
})
export class FormsProfilComponent implements OnInit {

  public listTelemetries: Array<any> = [];

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  @Output() listProfils = new EventEmitter();

  adminForm: FormGroup;
  checkedAll: boolean = false;
  public checkedAllConsumers: boolean = false;

  public listAffectations: Array<any> = [];
  public checkedconsumer: boolean = false;
  public listconfigCheckedTrue: any[] = [];
  public checkconsumerList: any[] = [];

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    if (this.currentObject !== undefined) {
      this.onFormPachValues();
      this.GetMetriquesByProfil();
    }
  }


  public GetMetriquesByProfil(): void {
    this.telemetrieService
      .GetMetriquesByProfil(this.currentObject?.id)
      .subscribe({
        next: (response) => {
          this.listAffectations = response['data'];
          // this.listconfigCheckedTrue =
          //   this.listAffectations.filter((data) => {
          //     return data.checked === true;
          //   });
          // this.listconfigCheckedTrue.forEach((c) => {
          //   this.checkconsumerList.push(c.id);
          // });
          // if (this.listAffectations.length === this.listconfigCheckedTrue.length) {
          //   this.checkedAllConsumers = true;
          // }
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  } public onCheckedOneConsumer(consumer: any) {
    if (this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.forEach((value, index) => {
        if (value == consumer.id)
          this.checkconsumerList.splice(index, 1);
      });
    } else if (!this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.push(consumer.id);
    }
    if (this.checkconsumerList.length === this.listAffectations.length) {
      this.checkedAllConsumers = true;
    } else {
      this.checkedAllConsumers = false;
    }
  }
  public OnCheckAllConsumer() {
    this.checkconsumerList = [];
    if (this.checkedAllConsumers) {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = true;
        this.checkconsumerList.push(consumer.id);
      });
    } else {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = false;
      });
      this.checkconsumerList.splice(0, this.checkconsumerList.length);
    }
  }
  public GetAllProfilSupervision(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
      .subscribe({
        next: (response) => {
          this.listProfils.emit(response['data']);
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllReferentielTelemetrie(): void {
    this.telemetrieService
      .GetAllReferentielTelemetrie({})
      .subscribe({
        next: (response) => {
          this.listTelemetries = response['data']['environnement'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public initForm(): void {
    this.adminForm = this.fb.group({
      nom: [''],
      description: [''],
    });
  }

  public close(): void {
    this.formsView.emit(false);
    this.adminForm.reset();
  }

  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject?.nom);
    this.adminForm.get('description').patchValue(this.currentObject?.description);
  }

  public handleUpdateProfilSupervision() {
    this.telemetrieService
      .handleUpdateProfilSupervision({
        profil_id: this.currentObject?.id,
        nom: this.adminForm.get('nom').value,
        description: this.adminForm.get('description').value,
        metriques: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.GetAllProfilSupervision();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
}
