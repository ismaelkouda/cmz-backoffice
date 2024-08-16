
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MappingService } from 'src/shared/services/mapping.service';
// import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import * as moment from 'moment';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';

@Component({
    selector: "app-filter-dossier-demande-integration",
    templateUrl: "./filter-dossier-demande-integration.component.html"
})

export class FilterDossierDemandeIntegrationComponent implements OnInit {
    formFilter: FormGroup;
    @Output() filter = new EventEmitter<{}>();
    public listStatuts: Array<any>;
    public listOperations: Array<any>;
    public listTraitementTransactions: Array<any>;


    constructor(private fb: FormBuilder, private mappingService: MappingService,
        private toastrService: ToastrService) {
        this.listOperations = this.mappingService.listOperations
        // Object.values(StatutTransaction).forEach(item => {
        //     this.listStatuts.push(item);
        // });
        // Object.values(TraitementTransaction).forEach(item => {
        //     this.listTraitementTransactions.push(item);
        // });
    }

    ngOnInit(): void {
        this.initFilterForm();
    }

    public initFilterForm() {
        // const filterState = this.carteSimStateService.getFilterState();
        this.formFilter = this.fb.group({
            operation: ['integration'],
            imsi: [null],
            msisdn: [null],
            statut: [null],
            traitement: [null],
            date_debut: [null],
            date_fin: [null]
        });;
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