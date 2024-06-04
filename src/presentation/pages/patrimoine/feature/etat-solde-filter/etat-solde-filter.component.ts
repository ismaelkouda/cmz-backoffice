import { LoadingBarService } from '@ngx-loading-bar/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TypeAlarme } from 'src/shared/enum/TypeAlarme.enum';

@Component({
    selector: 'app-etat-solde-filter',
    templateUrl: './etat-solde-filter.component.html'
})

export class EtatSoldeFilterComponent {
    public formFilter: FormGroup;
    public secondFilter: boolean = false;
    @Output() filter = new EventEmitter<{}>();
    public listAlarmes: Array<any> = [];
    private response: any = {};

    constructor(private fb: FormBuilder,
        private toastrService: ToastrService, private loadingBar: LoadingBarService,) {
        Object.values(TypeAlarme).forEach(item => {
            this.listAlarmes.push(item);
        });
    }

    async ngOnInit(): Promise<void> {
        this.initFormFilter();
    }


    public initFormFilter() {
        this.formFilter = this.fb.group({
            niveau_un_uuid: [null],
            niveau_deux_uuid: [null],
            niveau_trois_uuid: [null],
            usage_id: [null],
            msisdn: [null],
            imsi: [null],
            zone_trafic: [null],
            adresse_ip: [null],
            statut: [null],
            point_emplacement: [null]
        })
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onFilter() {
        this.filter.emit(this.formFilter.value);
    }
}