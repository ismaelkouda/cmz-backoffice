import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
import { ExcelService } from 'src/shared/services/excel.service';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-usage-metier',
    templateUrl: './usage-metier.component.html',
    styleUrls: ['./usage-metier.component.scss'],
})
export class UsageMetierComponent implements OnInit {
    public module: string;
    public subModule: string;
    public initialView: boolean = true;
    public formsView: boolean = false;
    public currentObject: any;
    public listUsages: Array<any> = [];
    public selectedUsage: string;
    public selectedTenant: any;
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public page: number = 0;
    public title = 'Usage metier - Système de Gestion de Collecte Centralisée';
    constructor(
        private toastrService: ToastrService,
        private clipboardApi: ClipboardService,
        private settingService: SettingService,
        public mappingService: MappingService,
        private excelService: ExcelService,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit(): void {
        this.GetAllUsageMetier();
        this.isFilter();
    }

    public GetAllUsageMetier() {
        this.settingService.getAllUsages({}).subscribe({
            next: (response) => {
                this.listUsages = response['data'];
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

    public copyData(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }

    public onInitForm(): void {
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
        this.listUsages = event;
    }
    public handleActivate(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous activer l'usage <br> ${data.nom_usage} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.settingService.HandleActiveUsage(data.id).subscribe({
                    next: (response) => {
                        this.GetAllUsageMetier();
                        this.toastrService.success(response.message);
                    },
                    error: (error) => {
                        this.toastrService.error(error.error.message);
                    },
                });
            }
        });
    }
    public handleDisable(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous désactiver l'usage <br> ${data.nom_usage} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.settingService.HandleDisableUsage(data.id).subscribe({
                    next: (response) => {
                        this.GetAllUsageMetier();
                        this.toastrService.success(response.message);
                    },
                    error: (error) => {
                        this.toastrService.error(error.error.message);
                    },
                });
            }
        });
    }
    public handleDelete(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous supprimer l'usage <br> ${data.nom_usage} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.settingService.OnDeleteUsage(data.id).subscribe({
                    next: (response) => {
                        this.GetAllUsageMetier();
                        this.toastrService.success(response.message);
                    },
                    error: (error) => {
                        this.toastrService.error(error.error.message);
                    },
                });
            }
        });
    }
    public isFilter(): boolean {
        return !this.selectedTenant && !this.selectedUsage ? true : false;
    }
    public OnExportExcel(): void {
        const data = this.listUsages.map((item: any) => ({
            'Nom usage': item?.nom_usage,
            Description: item?.description,
            Statut: item?.statut,
        }));
        this.excelService.exportAsExcelFile(data, `Lise des Usages Metiers`);
    }
    public onFilter() {
        this.settingService
            .getAllUsages({
                nom: this.selectedUsage,
            })
            .subscribe({
                next: (response) => {
                    this.listUsages = response['data'];
                    this.totalPage = response.data.last_page;
                    this.totalRecords = response.data.total;
                    this.recordsPerPage = response.data.per_page;
                    this.page = response.data?.current_page;
                    this.offset =
                        (response.data.current_page - 1) * this.recordsPerPage +
                        1;
                    ('');
                },
                error: (error) => {
                    this.toastrService.error(error.message);
                },
            });
    }
    public onPageChange(event) {
        this.p = event;
        if (this.isFilter()) {
            this.GetAllUsageMetier();
        } else {
            this.onFilter();
        }
    }
}
