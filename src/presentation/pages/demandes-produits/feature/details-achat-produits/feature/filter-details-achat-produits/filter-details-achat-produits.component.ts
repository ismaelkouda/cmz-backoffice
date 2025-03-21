import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
    selector: `app-filter-details-achat-produits`,
    templateUrl: `./filter-details-achat-produits.component.html`
})

export class FilterDetailsAchatProduitsComponent {

    public formFilter: FormGroup;
    @Output() filter = new EventEmitter<{}>();
    public secondFilter: boolean = false;
    @Input() listEtapeLigne: Array<Object>;
    @Input() listEtatLigne: Array<Object>;

    constructor(private toastrService: ToastrService, private fb: FormBuilder) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
      }
  
      public initFormFilter(): void {
          this.formFilter = this.fb.group({
                numero_produit: [null],
              statut: [null],
              traitement: [null],
              date_debut: [null],
              date_fin: [null],
          });
      }
  
      public onSubmitFilterForm(): void {
          const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid() ? this.formFilter.get("date_debut")?.value : null;
          const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid() ? this.formFilter.get("date_fin")?.value : null;
          if ((date_debut && date_fin)) {
              if (moment(date_debut).isAfter(moment(date_fin))) {
                  this.toastrService.error('Plage de date invalide');
                  return;
              }
          }
          this.filter.emit({ ...this.formFilter.value, date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : null, date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : null });
      }
}