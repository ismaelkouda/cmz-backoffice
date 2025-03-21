import { TABLE_SIM_DEMAND } from '../../data-access/constantes/sim-demand-table';
import { BADGE_ETAPE } from '../../../../constants/badge-etape.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { Component, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ModalParams } from '../../../../constants/modalParams.contant';
import { JournalComponent } from '../../../journal/journal.component';
import { SimDemand } from '../../../../interfaces/details-mobile-subscriptions.interface';
import { BADGE_ETAT } from '../../../../constants/badge-etat.contant';
import { TableConfig } from '../../../../services/table-export-excel-file.service';
const Swal = require("sweetalert2");
type ModalAction = { data: SimDemand, action: 'view-sim-demand' | 'journal-sim-demand', view: 'modal' };

@Component({
    selector: `app-table-sim-demand`,
    templateUrl: `./table-sim-demand.component.html`
})

export class TableSimDemandComponent {

    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    @Input() pagination;
    @Input() listSim: Array<SimDemand>;
    public IsLoading: boolean;
    public selectedDemand: Object;
    public readonly table: TableConfig = TABLE_SIM_DEMAND;

    constructor(public toastrService: ToastrService, private clipboardService: ClipboardService,
        private ngbModal: NgbModal,) { }

    copyData(dossier: any): void {
        this.toastrService.success("Copié dans le presse papier");
        this.clipboardService.copyFromContent(dossier);
    }

    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

    public getEtapeBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION: return "badge-dark";
            case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
            case BADGE_ETAPE.FINALISATEUR: return "badge-info";
            case BADGE_ETAPE.CLOTURE: return "badge-success";
        }
        return "badge-dark";
    }

    public getEtatBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION:
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE) return "badge-dark";
                if (data?.traitement === BADGE_ETAT.PARTIEL) return "badge-warning";
                if (data?.traitement === BADGE_ETAT.RECU) return "badge-dark";
                if (data?.traitement === BADGE_ETAT.APPROUVE) return "badge-success";
                if (data?.traitement === BADGE_ETAT.REJETE) return "badge-danger";
                break;

            case BADGE_ETAPE.TRAITEMENT:
                if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
                if (data?.traitement === BADGE_ETAT.TERMINE) return "badge-success";
                break;

            case BADGE_ETAPE.FINALISATEUR:
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE) { return "badge-warning"; }
                if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-warning"; }
                if (data?.traitement === BADGE_ETAT.LIVRE) { return "badge-primary"; }
                break;

            case BADGE_ETAPE.CLOTURE:
                if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-success"; }
                if (data?.traitement === BADGE_ETAT.TERMINE) { return "badge-success"; }
                if (data?.traitement === BADGE_ETAT.REFUSE) { return "badge-danger"; }
                if (data?.traitement === BADGE_ETAT.ABANDONNE) { return "badge-warning"; }
                if (data?.traitement === BADGE_ETAT.REJETE) { return "badge-danger"; }
                break;
        }
        return "badge-dark";
    }

    public showDialog(data: Object): void {
        if (data['message']) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons.fire({
                icon: "info",
                html: `<span><strong>Message</strong> : ${data["message"]}</span> <br/><br/> ${this.swalBootstrapMessage(data)}`,
                confirmButtonColor: "#F07427",
                confirmButtonText: "ok",
            });
        }
    }
    private swalBootstrapMessage(data: any) {
        return data?.action ? `<span><strong>Action</strong>: ${data?.['action']}</span>` : ``;
    }

    public handleAction(params: ModalAction): void {
        if (params.action === 'view-sim-demand') { this.showTraitement(params.data) }
        if (params.action === 'journal-sim-demand') { this.showJournal(params.data) };
    }

    showTraitement(sim: Object): void {
        // this.IsLoading = true;
        // const modalRef = this.ngbModal.open(TransactionShowComponent, ModalParams);
        // modalRef.componentInstance.transaction = { ...sim, current_date: sim.current_date, IsLoading: this.IsLoading };
        // modalRef.componentInstance.resultTraitement.subscribe((res) => {
        //     this.listTransactions = res
        // })
        // modalRef.componentInstance.IsLoading.subscribe((res) => {
        //     this.IsLoading = res;
        //     modalRef.componentInstance.IsLoadData = !res;
        // })
    }

    showJournal(sim: Object): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.transaction = sim['transaction'];
        modalRef.componentInstance.typeJournal = "transactions"
    }
}