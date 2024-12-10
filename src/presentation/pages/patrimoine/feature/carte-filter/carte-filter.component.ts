import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { ListCommuneService } from 'src/shared/services/list-commune.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { handle } from 'src/shared/functions/api.function';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { CarteSimStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-state.service';

@Component({
    selector: 'app-carte-filter',
    templateUrl: './carte-filter.component.html',
    styles: [
        `
            .col-md-2 {
                padding-right: 0;
            }
        `,
    ],
})
export class CarteFilterComponent implements OnInit {
    public secondFilter: boolean = false;
    @Output() filter = new EventEmitter<{}>();
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    @Input() filterData: Object;
    public formFilter: FormGroup;
    public listFirstLeveDatas: Array<any> = [];
    public listSecondLevelDatas: Array<any> = [];
    public listAPN: Array<any> = [];
    public listStatuts: Array<any> = [];
    public listThirdLevelDatas: Array<any> = [];
    public listUsages: Array<any> = [];
    private response: any = {};
    public listFormule: any = [];

    constructor(private fb: FormBuilder, private listCommuneService: ListCommuneService,
        public mappingService: MappingService, public settingService: SettingService,
        private toastrService: ToastrService, private loadingBar: LoadingBarService,
        private patrimoineService: PatrimoineService, private carteSimStateService: CarteSimStateService
    ) {
        this.listStatuts = [
            SimStatut.ACTIF,
            SimStatut.SUSPENDU,
            SimStatut.RESILIE,
        ];
    }

    ngOnInit(): void {
        this.initFormFilter();
        this.GetAllFirstLevel();
        this.GetAllThirdLevel();
        this.GetAllUsages();
        this.GetAllFormules();
        this.onChangeAPNValue();
    }

    async GetAllFirstLevel() {
        this.response = await handle(() => this.settingService.GetAllFirstLevelSimple({}), this.toastrService, this.loadingBar);
        if (this.response?.data) this.handleSuccessfulFirstLevel(this.response);
    }

    async GetAllThirdLevel() {
        this.response = await handle(() => this.settingService.GetAllThirdSimple({}), this.toastrService, this.loadingBar);
        if (this.response?.data) this.handleSuccessfulThirdLevel(this.response);
    }

    async GetAllUsages() {
        this.response = await handle(() => this.patrimoineService.GetAllUsages({}), this.toastrService, this.loadingBar);
        if (this.response?.data) this.handleSuccessfulUsages(this.response);
    }

    async GetAllFormules() {
        this.response = await handle(() => this.settingService.GetAllFormules({}), this.toastrService, this.loadingBar);
        if (this.response?.data) this.handleSuccessfulFormules(this.response);
    }

    private handleSuccessfulFirstLevel(response): void {
        this.listFirstLeveDatas = response['data'].map((element) => { return { ...element, fullName: `${element.nom}` } });
    }

    private handleSuccessfulThirdLevel(response): void {
        this.listThirdLevelDatas = response['data'];
    }

    private handleSuccessfulUsages(response): void {
        this.listUsages = response['data'];
    }

    private handleSuccessfulFormules(response): void {
        this.listFormule = response['data'];
    }
    // Reporting des services

    // stock source de SIM
    // stock local || stock Orange
    // suivi des ventes

    public initFormFilter() {
        // const filterState = this.carteSimStateService.getFilterState();
        this.formFilter = this.fb.group({
            niveau_un_uuid: [this.filterData?.['niveau_un_uuid'] ?? null],
            niveau_deux_uuid: [this.filterData?.['niveau_deux_uuid'] ?? null],
            statut: [this.filterData?.['statut'] ?? history?.state?.statut],
            msisdn: [this.filterData?.['msisdn'] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
            imsi: [this.filterData?.['imsi'] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
            adresse_ip: [this.filterData?.['adresse_ip'] ?? null],
            usage_id: [this.filterData?.['usage_id'] ?? null],
            apn: [this.filterData?.['apn'] ?? null],
            niveau_trois_uuid: [this.filterData?.['niveau_trois_uuid'] ?? null],
            formule_uuid: [this.filterData?.['formule_uuid'] ?? null],
            zone_trafic: [this.filterData?.['zone_trafic'] ?? null],
            point_emplacement: [this.filterData?.['point_emplacement'] ?? null],
        });
        this.formFilter.get("msisdn").valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.formFilter.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
        this.formFilter.get("imsi").valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
            }
        });
    }

    public onChangeFirstLvel(uuid: any) {
        this.listSecondLevelDatas = [];
        this.listFirstLeveDatas.find((element) => {
            if (element.uuid === uuid) this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
        });
    }

    public onChangeAPNValue() {
        this.settingService.GetAllAPN({}).subscribe({
            next: (response) => {
                this.listAPN = response["data"];
                console.log('this.listAPN', this.listAPN)
            },
            error: (error) => {
                this.toastrService.error(error.message);
            },
        })
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm() {
        this.filter.emit(this.formFilter.value);
    }
}
