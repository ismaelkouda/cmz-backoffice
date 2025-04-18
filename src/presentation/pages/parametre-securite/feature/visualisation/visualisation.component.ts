import { ParametreSecuriteService } from './../../data-access/parametre-securite.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingService } from 'src/shared/services/mapping.service';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-visualisation',
    templateUrl: './visualisation.component.html',
    styleUrls: ['./visualisation.component.scss'],
})
export class VisualisationComponent implements OnInit {
    @Output() visualisationView = new EventEmitter();
    @Input() currentObject;
    @Output() listProfils = new EventEmitter();
    public listDatas: Array<any> = [];
    public display: boolean = false;
    public listAffectations: any[] = [];
    public checkedAllConsumers: boolean = false;
    public checkconsumerList: Array<any> = [];
    public selectedProfil: any;

    constructor(
        private parametreSecuriteService: ParametreSecuriteService,
        private toastrService: ToastrService,
        public mappingService: MappingService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.GetAllUsersWithProfil();
        this.GetAllProfilSupervisions();
    }
    public GetAllProfilHabilitations(): void {
        this.parametreSecuriteService.GetAllProfilHabilitations({}).subscribe({
            next: (response) => {
                this.listProfils.emit(response['data']);
                this.close();
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public GetAllProfilSupervisions(): void {
        this.parametreSecuriteService.GetAllProfilHabilitations({}).subscribe({
            next: (response) => {
                this.listDatas = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    public GetAllUsersWithProfil() {
        this.parametreSecuriteService
            .GetAllUsersWithProfil({}, this.currentObject?.id)
            .subscribe({
                next: (response) => {
                    this.listAffectations = response['data'];
                },
                error: (error) => {
                    this.toastrService.error(error.message);
                },
            });
    }
    public onCheckedOneConsumer(consumer: any) {
        if (this.checkconsumerList.includes(consumer.id)) {
            this.checkconsumerList.forEach((value, index) => {
                if (value == consumer.id)
                    this.checkconsumerList.splice(index, 1);
            });
        } else if (!this.checkconsumerList.includes(consumer.id)) {
            this.checkconsumerList.push(consumer.id);
        }
        if (this.checkconsumerList.length === this.listAffectations.length) {
            this.checkedAllConsumers = true;
        } else {
            this.checkedAllConsumers = false;
        }
    }
    public OnCheckAllConsumer() {
        this.checkconsumerList = [];
        if (this.checkedAllConsumers) {
            this.listAffectations.forEach((consumer) => {
                consumer.checked = true;
                this.checkconsumerList.push(consumer.id);
            });
        } else {
            this.listAffectations.forEach((consumer) => {
                consumer.checked = false;
            });
            this.checkconsumerList.splice(0, this.checkconsumerList.length);
        }
    }
    public close(): void {
        this.visualisationView.emit(false);
    }
    openForm(content) {
        this.GetAllProfilSupervisions();
        this.modalService.open(content);
    }
    hideForm() {
        this.modalService.dismissAll();
        this.selectedProfil = undefined;
    }
    public handleSaveReaffectation() {
        this.parametreSecuriteService
            .handleReaffectation({
                profil_user_id: this.selectedProfil?.id,
                users: this.checkconsumerList,
            })
            .subscribe({
                next: (response) => {
                    this.GetAllProfilHabilitations();
                    this.hideForm();
                    this.selectedProfil = undefined;
                    this.toastrService.success(response.message);
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    public handleRetraitSim(): void {
        Swal.fire({
            title: 'En êtes vous sûr ?',
            html: `Voulez-vous retirer ce(s) SIM(s)`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.parametreSecuriteService
                    .handleRetrait({
                        profil_user_id: this.selectedProfil?.id,
                        users: this.checkconsumerList,
                    })
                    .subscribe({
                        next: (response) => {
                            this.GetAllProfilHabilitations();
                            this.selectedProfil = undefined;
                            this.toastrService.success(response.message);
                        },
                        error: (error) => {
                            this.toastrService.error(error.error.message);
                        },
                    });
            }
        });
    }
}
