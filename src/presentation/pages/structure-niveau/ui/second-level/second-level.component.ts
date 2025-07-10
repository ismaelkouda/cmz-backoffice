import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/shared/services/excel.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from 'src/shared/utils/spacer.validator';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { CurrentUser } from '../../../../../shared/interfaces/current-user.interface';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-second-level',
    templateUrl: './second-level.component.html',
    styleUrls: ['./second-level.component.scss'],
})
export class SecondLevelComponent implements OnInit {
    public initialView: boolean = true;
    public formsView: boolean = false;
    public affectationView: boolean = false;
    public visualisationView: boolean = false;
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public page: number = 0;
    public currentObject: any;
    public listCurrentLevelDatas: Array<any> = [];
    public listFirstLevelDatas: Array<any> = [];
    public selectedNom: string;
    public selectedParent: any;
    public currentLevelLibelle: string | undefined;
    public childLevelLibelle: string | undefined;
    public parentLevelLibelle: string | undefined;
    public currentLevelMenus: string | undefined;
    public adminForm: FormGroup;
    public currentTabsIndex: number = 0;

    private destroy$ = new Subject<void>();
    public title = '2ème niveau - Système de Gestion de Collecte Centralisée';
    constructor(
        private settingService: SettingService,
        private toastrService: ToastrService,
        public mappingService: MappingService,
        private excelService: ExcelService,
        private clipboardApi: ClipboardService,
        private titleService: Title,
        private fb: FormBuilder,
        private encodingService: EncodingDataService
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.parentLevelLibelle = user?.structure_organisationnelle?.niveau_1;
        this.currentLevelLibelle = user?.structure_organisationnelle?.niveau_2;
        this.childLevelLibelle = user?.structure_organisationnelle?.niveau_3;
        this.currentLevelMenus =
            user?.structure_organisationnelle?.niveau_2_menu;
        this.GellCurrentLevel();
        this.GellAllFirstLevel();
        this.onInitForm();
        this.isFilter();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public GellCurrentLevel() {
        this.settingService.getAllExploiatations({}, this.p).subscribe({
            next: (response) => {
                this.listCurrentLevelDatas = response.data.data;
                this.totalPage = response.data.last_page;
                this.totalRecords = response.data.total;
                this.recordsPerPage = response.data.per_page;
                this.page = response.data?.current_page;
                this.offset =
                    (response.data.current_page - 1) * this.recordsPerPage + 1;
            },
            error: (error) => {
                this.toastrService.error(error.message);
            },
        });
    }
    public onFilter() {
        this.settingService
            .getAllExploiatations(
                {
                    nom: this.selectedNom,
                    niveau_un_uuid: this.selectedParent,
                },
                this.p
            )
            .subscribe({
                next: (response) => {
                    this.listCurrentLevelDatas = response.data.data;
                    this.totalPage = response.data.last_page;
                    this.totalRecords = response.data.total;
                    this.recordsPerPage = response.data.per_page;
                    this.page = response.data?.current_page;
                    this.offset =
                        (response.data.current_page - 1) * this.recordsPerPage +
                        1;
                },
                error: (error) => {
                    this.toastrService.error(error.message);
                },
            });
    }
    public onPageChange(event) {
        this.p = event;
        if (this.isFilter()) {
            this.GellCurrentLevel();
        } else {
            this.onFilter();
        }
    }
    public OnRefresh() {
        this.p = 1;
        this.GellCurrentLevel();
        this.selectedNom = null;
        this.selectedParent = null;
    }
    copyData(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }

    public GellAllFirstLevel() {
        this.settingService.GetAllFirstLevelSimple({}).subscribe({
            next: (response) => {
                this.listFirstLevelDatas = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.message);
            },
        });
    }

    onInitForm() {
        this.adminForm = this.fb.group({
            nom: ['', [Validators.required, FormValidator.cannotContainSpace]],
            code: [
                '',
                [
                    Validators.required,
                    FormValidator.cannotContainSpace,
                    FormValidator.symbolsOnly,
                ],
            ],
            niveau_un_uuid: ['', [Validators.required]],
        });
    }
    public openForm(): void {
        this.initialView = false;
        this.formsView = true;
        this.currentObject = undefined;
    }
    public onEditForm(data: any): void {
        this.initialView = false;
        this.formsView = true;
        this.currentObject = data;
    }
    public onShowForm(data: any): void {
        this.initialView = false;
        this.formsView = true;
        this.currentObject = { ...data, show: true };
    }
    public pushStatutView(event: boolean): void {
        this.formsView = event;
        this.initialView = !event;
    }
    public pushListDatas(event: any): void {
        this.listCurrentLevelDatas = event;
    }
    handleChangeTabviewIndex(e) {
        this.currentTabsIndex = e.index;
    }
    public OnExportExcel(): void {
        const data = this.listCurrentLevelDatas.map((item: any) => ({
            [this.currentLevelLibelle]: item?.nom,
            [this.parentLevelLibelle]: item?.niveau_un?.nom,
            '# SIM Affectées': item?.sims_count,
        }));
        this.excelService.exportAsExcelFile(
            data,
            `Lise des ${this.currentLevelLibelle}`
        );
    }
    public isFilter(): boolean {
        return !this.selectedNom && !this.selectedParent ? true : false;
    }
}
