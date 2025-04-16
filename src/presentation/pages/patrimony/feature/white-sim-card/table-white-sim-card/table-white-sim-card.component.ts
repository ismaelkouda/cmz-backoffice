import { whiteSimCardTableConstant } from './../../../data-access/white-sim-card/constants/white-sim-card-table.constant';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { whiteSimCardInterface } from '../../../data-access/white-sim-card/interfaces/white-sim-card.interface';
import { whiteSimCardApiService } from '../../../data-access/white-sim-card/services/white-sim-card-api.service';
import { whiteSimCardFilterInterface } from '../../../data-access/white-sim-card/interfaces/white-sim-card-filter.interface';
import { JournalComponent } from '../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { T_WHITE_SIM_CARD_STATUS_ENUM, WHITE_SIM_CARD_STATUS_ENUM } from '../../../data-access/white-sim-card/enums/white-sim-card-status.enum';

type Action = PageAction | ModalAction;
type PageAction = { data: whiteSimCardInterface, action: 'view-white-sim-card', view: 'page' };
type ModalAction = { data: whiteSimCardInterface, action: 'journal-white-sim-card', view: 'modal' };
type TYPE_COLOR_STATUS_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-white-sim-card',
    templateUrl: './table-white-sim-card.component.html',
    styles: [`.map { width: 100%; height: 100vh; min-height: 400px; display: block; }`]
})

export class TableWhiteSimCardComponent {

    @Input() spinner: boolean;
    @Input() listWhiteSimCard$: Observable<Array<whiteSimCardInterface>>;
    @Input() whiteSimCardSelected: whiteSimCardInterface;
    @Input() pagination$: Observable<Paginate<whiteSimCardInterface>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public readonly table: TableConfig = whiteSimCardTableConstant;

    constructor(private toastService: ToastrService, private clipboardService: ClipboardService, private ngbModal: NgbModal,
        private whiteSimCardApiService: whiteSimCardApiService, private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,) {
    }

    public pageCallback() {
        this.whiteSimCardApiService.fetchWhiteSimCard({} as whiteSimCardFilterInterface);
    }

    public onExportExcel(): void {
        this.listWhiteSimCard$.subscribe(data => {
            if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "list_white_sim_cards"); }
        });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    getStatusWhiteSimCardBadge(selectedWhiteSimCard?: { statut: T_WHITE_SIM_CARD_STATUS_ENUM }): TYPE_COLOR_STATUS_BADGE {
        if (!selectedWhiteSimCard || !selectedWhiteSimCard.statut) { return 'badge-success'; }

        const etapeMap: Record<T_WHITE_SIM_CARD_STATUS_ENUM, TYPE_COLOR_STATUS_BADGE> = {
            [WHITE_SIM_CARD_STATUS_ENUM.AVAILABLE]: 'badge-success',
            [WHITE_SIM_CARD_STATUS_ENUM.OUT]: 'badge-danger',
        };
        return etapeMap[selectedWhiteSimCard.statut] || 'badge-success';
    }

    private onSelectWhiteSimCard(selectedWhiteSimCard: whiteSimCardInterface): void {
        this.whiteSimCardSelected = selectedWhiteSimCard;
        this.whiteSimCardApiService.setWhiteSimCardSelected(selectedWhiteSimCard);
    }

    public handleAction(params: Action): void {
        this.onSelectWhiteSimCard(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'journal-white-sim-card') { this.handleWhiteSimCardJournal(params.data) }
                break;

            case 'page':
                if (params.action === 'view-white-sim-card') { this.interfaceUser.emit(params) };
                break;
        }
    }

    public handleWhiteSimCardJournal(selectedWhiteSimCard: whiteSimCardInterface): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.typeJournal = "whiteSimCard";
        modalRef.componentInstance.numero_demande = selectedWhiteSimCard['reference'];
    }
}
