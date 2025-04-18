import {
    DossierWhiteSimCard,
    TABLE_WHITE_SIM_CARD,
} from './../../../data-access/white-sim-card/table-white-sim-card';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { SharedDataService } from '../../../../../../shared/services/shared-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from '../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { ClipboardService } from 'ngx-clipboard';

type TYPECOPY = 'numero_demande';
type Action = PageAction | ModalAction;
type PageAction = {
    data: DossierWhiteSimCard;
    action: 'détails';
    view: 'page';
};
type ModalAction = {
    data: DossierWhiteSimCard;
    action: 'journal';
    view: 'modal';
};
@Component({
    selector: `app-table-white-sim-card`,
    templateUrl: `./table-white-sim-card.component.html`,
})
export class TableWhiteSimCardComponent {
    @Output() interfaceUser = new EventEmitter<PageAction>();
    @Input() listWhiteSimCard: Array<DossierWhiteSimCard>;
    @Input() pagination: any;
    @Input() spinner: boolean;
    @Input() selectedWhiteSimCard: DossierWhiteSimCard;
    public table: TableConfig = TABLE_WHITE_SIM_CARD;

    constructor(
        public toastService: ToastrService,
        private sharedDataService: SharedDataService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private ngbModal: NgbModal,
        private clipboardService: ClipboardService
    ) {}

    public copyData(
        selectedDetailsWhiteSimCard: DossierWhiteSimCard,
        type: TYPECOPY
    ): void {
        this.toastService.success('Copié dans le presse papier');
        this.clipboardService.copyFromContent(
            selectedDetailsWhiteSimCard[type]
        );
    }

    public pageCallback() {
        this.sharedDataService.sendPatrimoineWhiteSimCard();
    }

    public onExportExcel(): void {
        this.tableExportExcelFileService.exportAsExcelFile(
            this.listWhiteSimCard,
            this.table,
            'liste_dossiers_carte_sim_blanche'
        );
    }

    public getStatutBadge(statut: string): string {
        switch (statut) {
            case 'disponible':
                return 'badge-success';

            case 'epuisé':
                return 'badge-danger';
        }
        return 'badge-dark';
    }

    public onAction(params: Action): void {
        this.selectWhiteSimCard(params.data);
        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;

            case 'modal':
                this.onOpenModal(params);
                break;
        }
    }

    private onOpenModal(params: ModalAction): void {
        if (params.action === 'journal') this.showJournal(params.data);
    }

    public showJournal(selectedWhiteSimCard: Object): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.typeJournal = 'whiteSimCard';
        modalRef.componentInstance.numero_demande =
            selectedWhiteSimCard['reference'];
    }

    private selectWhiteSimCard(
        selectedWhiteSimCard: DossierWhiteSimCard
    ): void {
        this.selectedWhiteSimCard = selectedWhiteSimCard;
    }
}
