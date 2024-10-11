import { LoadingBarService } from '@ngx-loading-bar/core';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
import { Title } from '@angular/platform-browser';
import { ExcelService } from 'src/shared/services/excel.service';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from 'src/shared/constants/swalWithBootstrapButtonsParams.constant';
import { handle } from 'src/shared/functions/api.function';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    public listUsers: Array<any> = [];
    public selectedProfil: any;
    public initialView: boolean = true;
    public formsView: boolean = false;
    public currentObject: any;
    public alerteMessage: string;
    public maximumMessage: string;
    public principalUsername: string;
    public suffixEmail: string;
    public currentTabsIndex: number = 0;
    public title = 'Utilisateurs - Système de Gestion de Collecte Centralisée';
    public nb_max_users: number;
    constructor(
        private settingService: SettingService,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        public mappingService: MappingService,
        private titleService: Title,
        private excelService: ExcelService,
        private parametreSecuriteService: ParametreSecuriteService
    ) {
        this.titleService.setTitle(`${this.title}`);
        this.suffixEmail = this.mappingService.suffixEmail;
        this.principalUsername = `admin${this.suffixEmail}`;
        this.nb_max_users = this.mappingService.tenant.nb_max_users;
        this.alerteMessage = `Le nombre d'utilisateurs a atteint la limite autorisée : ${this.nb_max_users}`;
        this.maximumMessage = `Le nombre maximum d'utilisateurs autorisés dans le système est de ${this.nb_max_users}`;
    }

    ngOnInit() {
        this.GetAllUsers();
    }
    public GetAllUsers() {
        this.settingService.getAllUsers({}).subscribe({
            next: (response) => {
                this.listUsers = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    public onInitForm(): void {
        if (this.listUsers.length >= this.nb_max_users) {
            this.toastrService.error(
                "Le nombre d'utilisateurs a atteint la limite autorisée"
            );
        } else {
            this.initialView = false;
            this.formsView = true;
            this.currentObject = undefined;
        }
    }

    public onChangePassword(data: Object): void {
        const title = "Réinitialisation de mot de passe";
        const htmlMessage = "L'utilisateur <u>{nom} {prenoms}</u> recevra <br> un mail de réinitialisation de son mot de passe";
        Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass }).fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, title: title, html: htmlMessage.replace("{nom}", data["nom"]).replace("{prenoms}", data["prenoms"]) })
            .then((result) => {
                if (result.isConfirmed) {
                    handle(() => this.parametreSecuriteService.handleChangePassword({id: data?.["id"]}), this.toastrService, this.loadingBarService)
                        .then((response: any) => {
                            if (response.error === false) {
                                this.toastrService.success(response.message);
                                this.GetAllUsers();
                            }
                        });
                }
            });
    }

    public handleActivateUser(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous Activer l'utilisateur <br> ${data.username} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.parametreSecuriteService
                    .handleActivateUser(data.id)
                    .subscribe({
                        next: (response) => {
                            this.toastrService.success(response.message);
                            this.GetAllUsers();
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
    }
    public handleDisableUser(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous Désactiver l'utilisateur <br> ${data.username} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.parametreSecuriteService
                    .handleDisableUser(data.id)
                    .subscribe({
                        next: (response) => {
                            this.toastrService.success(response.message);
                            this.GetAllUsers();
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
    }
    public OnDelete(data: any): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous supprimer l'utilisateur <br> ${data.nom}  ${data.prenoms} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.settingService
                    .OnDeleteUser({
                        username: data?.username,
                    })
                    .subscribe({
                        next: (response) => {
                            this.toastrService.success(response.message);
                            this.GetAllUsers();
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
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
        this.listUsers = event;
    }
    handleChangeTabviewIndex(e) {
        this.currentTabsIndex = e.index;
        console.info(this.currentTabsIndex);
    }
    public disableAction(): boolean {
        return this.listUsers === undefined || this.listUsers?.length === 0
            ? true
            : false;
    }
    public OnExportExcel(): void {
        const data = this.listUsers.map((item: any) => ({
            Nom: item?.nom,
            Prénoms: item?.prenoms,
            Code: item?.code,
            'Nom de connexion': item?.username,
            Contact: item?.contacts,
            Statut: item?.statut,
            'Date Création': item?.created_at,
        }));
        this.excelService.exportAsExcelFile(data, 'Liste des Utilisateurs');
    }
}
