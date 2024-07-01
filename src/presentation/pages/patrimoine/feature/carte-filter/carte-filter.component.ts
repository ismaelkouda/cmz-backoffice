import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { ListCommuneService } from 'src/shared/services/list-commune.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { handle } from 'src/shared/functions/api.function';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';

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
    public formFilter: FormGroup;
    public listFirstLeveDatas: Array<any> = [];
    public listSecondLevelDatas: Array<any> = [];
    public listStatuts: Array<any> = [];
    public listThirdLevelDatas: Array<any> = [];
    public listUsages: Array<any> = [];
    private response: any = {};
    public listFormule: any = [];

    constructor(
        private fb: FormBuilder,
        private listCommuneService: ListCommuneService,
        public mappingService: MappingService,
        public settingService: SettingService,
        private toastrService: ToastrService,
        private loadingBar: LoadingBarService,
        private patrimoineService: PatrimoineService
    ) {
        this.listStatuts = [
            SimStatut.ACTIF,
            SimStatut.SUSPENDU,
            SimStatut.RESILIE,
        ];
    }

    async ngOnInit(): Promise<void> {
        this.initFormFilter();
        await this.GetAllFirstLevel();
        await this.GetAllThirdLevel();
        await this.GetAllUsages();
        await this.GetAllFormules();
    }

    async GetAllFirstLevel() {
        this.response = await handle(
            () => this.settingService.GetAllFirstLevelSimple({}),
            this.toastrService,
            this.loadingBar
        );
        this.handleSuccessfulFirstLevel(this.response);
    }

    async GetAllThirdLevel() {
        this.response = await handle(
            () => this.settingService.GetAllThirdSimple({}),
            this.toastrService,
            this.loadingBar
        );
        this.handleSuccessfulThirdLevel(this.response);
    }

    async GetAllUsages() {
        this.response = await handle(
            () => this.patrimoineService.GetAllUsages({}),
            this.toastrService,
            this.loadingBar
        );
        this.handleSuccessfulUsages(this.response);
    }

    async GetAllFormules() {
        this.response = await handle(
            () => this.settingService.GetAllFormules({}),
            this.toastrService,
            this.loadingBar
        );
        this.handleSuccessfulFormules(this.response);
    }

    private handleSuccessfulFirstLevel(response): void {
        this.listFirstLeveDatas = response['data'].map((element) => {
            return { ...element, fullName: `${element.nom}` };
        });
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

    public initFormFilter() {
        this.formFilter = this.fb.group({
            niveau_un_uuid: [null],
            niveau_deux_uuid: [null],
            niveau_trois_uuid: [null],
            apn: [null],
            formule_uuid: [null],
            usage_id: [null],
            msisdn: [null],
            imsi: [null],
            zone_trafic: [null],
            adresse_ip: [null],
            statut: [history?.state?.statut],
            point_emplacement: [null],
        });
    }

    public onChangeFirstLvel(uuid: any) {
        this.listSecondLevelDatas = [];
        this.listFirstLeveDatas.find((element) => {
            if (element.uuid === uuid) {
                this.listSecondLevelDatas =
                    this.listCommuneService.getListCommune(element);
            }
        });
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onFilter() {
        this.filter.emit(this.formFilter.value);
    }
}
