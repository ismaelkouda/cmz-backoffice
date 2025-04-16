import { LoadingBarService } from '@ngx-loading-bar/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TypeAlarme } from 'src/shared/enum/TypeAlarme.enum';
import { handle } from 'src/shared/functions/api.function';
import { SettingService } from 'src/shared/services/setting.service';
// import { ListCommuneService } from 'src/shared/services/list-commune.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';

@Component({
    selector: 'app-etat-solde-filter',
    templateUrl: './etat-solde-filter.component.html'
})

export class EtatSoldeFilterComponent {
    @Output() filter = new EventEmitter<{}>();
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    public formFilter: FormGroup;
    public secondFilter: boolean = false;
    public listAlarmes: Array<any> = [];
    private response: any = {};
    public listFirstLeveDatas: Array<any> = [];
    public listSecondLevelDatas: Array<any> = [];
    public listThirdLevelDatas: Array<any> = [];
    public listUsages: Array<any> = [];
    public listFormule: any = [];

    constructor(private fb: FormBuilder, public settingService: SettingService,
        private toastrService: ToastrService, private loadingBar: LoadingBarService,
        private patrimoineService: PatrimoineService) {
        Object.values(TypeAlarme).forEach(item => {
            this.listAlarmes.push(item);
        });
    }

    ngOnInit(): void {
        this.initFormFilter();
        this.GetAllFirstLevel();
        this.GetAllThirdLevel();
        this.GetAllUsages();
        this.GetAllFormules();
    }

    async GetAllFirstLevel() {
        this.response = await handle(() => this.settingService.GetAllFirstLevelSimple({}), this.toastrService, this.loadingBar);
        if(this.response?.data) this.handleSuccessfulFirstLevel(this.response);
    }

    private handleSuccessfulFirstLevel(response): void {
        this.listFirstLeveDatas = response['data'].map((element) => { return { ...element, fullName: `${element.nom}` } });
    }

    public onChangeFirstLvel(uuid: any) {
        this.listSecondLevelDatas = [];
        this.listFirstLeveDatas.find((element) => {
            // if (element.uuid === uuid)  this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
        });
    }

    async GetAllThirdLevel() {
        this.response = await handle(() => this.settingService.GetAllThirdSimple({}), this.toastrService, this.loadingBar);
        if(this.response?.data) this.handleSuccessfulThirdLevel(this.response);
    }

    private handleSuccessfulThirdLevel(response): void {
        this.listThirdLevelDatas = response['data'];
    }

    async GetAllUsages() {
        this.response = await handle(() => this.patrimoineService.GetAllUsages({}), this.toastrService, this.loadingBar);
        if(this.response?.data) this.handleSuccessfulUsages(this.response);
    }

    private handleSuccessfulUsages(response): void {
        this.listUsages = response['data'];
    }

    async GetAllFormules() {
        this.response = await handle(() => this.settingService.GetAllFormules({}), this.toastrService, this.loadingBar);
        if(this.response?.data) this.handleSuccessfulFormules(this.response);
    }

    private handleSuccessfulFormules(response): void {
        this.listFormule = response['data'];
    }


    public initFormFilter() {
        this.formFilter = this.fb.group({
            niveau_un_uuid: [null],
            niveau_deux_uuid: [null],
            niveau_trois_uuid: [null],
            usage_id: [null],
            imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
            msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
            zone_trafic: [null],
            adresse_ip: [null],
            statut: [null],
            point_emplacement: [null]
        })
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

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm() {
        this.filter.emit(this.formFilter.value);
    }
}