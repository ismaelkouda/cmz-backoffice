import { ToastrService } from 'ngx-toastr';
import { ParametreSecuriteService } from './../../data-access/parametre-securite.service';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
import { ExcelService } from 'src/shared/services/excel.service';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-profil-habilitation',
    templateUrl: './profil-habilitation.component.html',
    styleUrls: ['./profil-habilitation.component.scss'],
})
export class ProfilHabilitationComponent implements OnInit {
    public listProfils: Array<any> = [];
    public listUsers: Array<any> = [];
    public selectedProfil: any;
    public currentObject: any;
    public initialView: boolean = true;
    public formsView: boolean = false;
    public affectationView: boolean = false;
    public visualisationView: boolean = false;
    public currentTabsIndex: number = 0;
    public title =
        'Profil habilitations - Système de Gestion de Collecte Centralisée';

    constructor(
        private parametreSecuriteService: ParametreSecuriteService,
        private toastrService: ToastrService,
        private clipboardApi: ClipboardService,
        public mappingService: MappingService,
        private excelService: ExcelService,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.GetAllProfilHabilitations();
    }
    public GetAllProfilHabilitations() {
        this.parametreSecuriteService.GetAllProfilHabilitations({}).subscribe({
            next: (response) => {
                this.listProfils = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    OnRefresh() {
        this.GetAllProfilHabilitations();
        this.selectedProfil = null;
    }
    copyData(data: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardApi.copyFromContent(data);
    }
    onInitForm() {
        this.initialView = false;
        this.formsView = true;
        this.currentObject = undefined;
    }
    public onViewAffection(data: any): void {
        this.initialView = false;
        this.affectationView = true;
        this.currentObject = data;
    }
    public onEditForm(data: any): void {
        this.currentObject = data;
        this.initialView = false;
        this.formsView = true;
    }
    public onViewVisualisation(data: any): void {
        this.initialView = false;
        this.visualisationView = true;
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
    public pushAffectationView(event: boolean): void {
        this.affectationView = event;
        this.initialView = !event;
    }
    public pushVisualisationView(event: boolean): void {
        this.visualisationView = event;
        this.initialView = !event;
    }
    public pushListProfils(event: any): void {
        this.listProfils = event;
    }
    public handleActivateProfil(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous Activer le profil <br> ${data.nom} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.parametreSecuriteService
                    .handleActivateProfil(data.id)
                    .subscribe({
                        next: (response) => {
                            this.toastrService.success(response.message);
                            this.GetAllProfilHabilitations();
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
    }
    public handleDisableProfil(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous Désactiver le profil <br> ${data.nom} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.parametreSecuriteService
                    .handleDisableProfil(data.id)
                    .subscribe({
                        next: (response) => {
                            this.toastrService.success(response.message);
                            this.GetAllProfilHabilitations();
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
    }
    public handleleteProfilHabilitation(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous supprimer le profil ${data.nom} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.parametreSecuriteService
                    .handleleteProfilHabilitation({}, data.id)
                    .subscribe({
                        next: (response) => {
                            this.GetAllProfilHabilitations();
                            this.toastrService.success(response.message);
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
    }
    handleChangeTabviewIndex(e) {
        this.currentTabsIndex = e.index;
    }
    public disableAction(): boolean {
        return this.listProfils === undefined || this.listProfils?.length === 0
            ? true
            : false;
    }
    public OnExportExcel(): void {
        const data = this.listProfils.map((item: any) => ({
            'Nom du Profil': item?.nom,
            'Description du Profil': item?.description,
            'Date de création': item?.created_at,
            'Date de modification': item?.updated_at,
            '# Utilisateurs': item?.users_count,
            Statut: item?.statut,
        }));
        this.excelService.exportAsExcelFile(
            data,
            'Liste des Profils et Habilitations'
        );
    }
}
