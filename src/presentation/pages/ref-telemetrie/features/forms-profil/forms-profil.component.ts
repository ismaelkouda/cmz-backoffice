import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { get } from 'http';

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
  public clonedMetrique: { [s: string]: any } = {};
  public currentMetrique: any;
  public globalMetriquesEditRow: Array<any> = [];

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.GetAllReferentielTelemetrie();
    this.isValidate();
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
          this.globalMetriquesEditRow = this.listAffectations.filter(item => {
            return item?.statut === 'actif'
          }).map((data) => {
            return { metrique_id: data?.id, seuil: data?.seuil, statut: data?.statut }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
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
          this.listTelemetries = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public OnEditOneRowMetrique(item: any) {
    this.currentMetrique = item;
    this.clonedMetrique[item.id] = { ...item };
  }

  public onRowEditMetriqueSave(metrique: any) {
    const currentMetrique = this.clonedMetrique[metrique.id];
    const data = {
      metrique_id: currentMetrique.id,
      ...(metrique.seuil === null ? { seuil: currentMetrique.seuil } : { seuil: metrique.seuil }),
      ...(metrique.statut === null ? { statut: currentMetrique.statut } : { statut: metrique.statut })
    };
    const checkValue = metriqueParam => this.globalMetriquesEditRow.some(({ metrique_id }) => metrique_id == metriqueParam);
    if (data?.statut === 'inactif' || data?.seuil === null) {
      const indexOfItemInArray = this.globalMetriquesEditRow.findIndex(q => q.metrique_id === data.metrique_id);
      this.globalMetriquesEditRow.splice(indexOfItemInArray, 1);
      // metrique.statut = 'inactif';
      metrique.seuil = null;
      this.toastrService.warning("Veuillez activez l'alarme ou Configurer le seuil");
      return;
    } else {
      if (checkValue(data.metrique_id) === false) {
        this.globalMetriquesEditRow.push(data);
        this.toastrService.info('Enregistrement en attente !', 'EDITION');
      } else {
        const indexOfItemInArray = this.globalMetriquesEditRow.findIndex(q => q.metrique_id === data.metrique_id);
        this.globalMetriquesEditRow.splice(indexOfItemInArray, 1, data);
      }
    }
  }
  public onCancelRowMetrique(metrique: any, index: number) {
    this.listAffectations[index] = this.clonedMetrique[metrique.id];
    delete this.clonedMetrique[metrique.id];
    this.globalMetriquesEditRow.forEach((index) => {
      this.globalMetriquesEditRow.splice(index, 1);
    });
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
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
    this.adminForm.get('nom').disable()
  }

  public handleSaveProfilSupervision() {
    this.telemetrieService
      .handleSaveProfilSupervision({
        nom: this.adminForm.get('nom').value,
        description: this.adminForm.get('description').value,
        metriques: [...this.globalMetriquesEditRow]
      }).subscribe({
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
  public handleUpdateProfilSupervision() {
    this.telemetrieService
      .handleUpdateProfilSupervision({
        profil_id: this.currentObject?.id,
        nom: this.adminForm.get('nom').value,
        description: this.adminForm.get('description').value,
        metriques: [...this.globalMetriquesEditRow]
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
  isValidate(): boolean {
    return ((this.globalMetriquesEditRow.length === 0) && !this.adminForm.valid) ? true : false
  }
}
