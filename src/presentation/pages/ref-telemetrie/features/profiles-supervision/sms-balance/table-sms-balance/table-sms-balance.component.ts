import {
    SmsBalance,
    TABLE_SMS_BALANCE,
} from './../../../data-access/sms-balance/table-sms-balance';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from '../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { ClipboardService } from 'ngx-clipboard';
import { SharedDataService } from '../../../../../../../shared/services/shared-data.service';

type TYPECOPY = 'numero_demande';
type Action = PageAction | ModalAction;
type PageAction = { data: SmsBalance; action: 'détails'; view: 'page' };
type ModalAction = { data: SmsBalance; action: 'journal'; view: 'modal' };

@Component({
    selector: `app-table-sms-balance`,
    templateUrl: `./table-sms-balance.component.html`,
})
export class TableSmsBalanceComponent {
    @Output() interfaceUser = new EventEmitter<PageAction>();
    @Input() listSmsBalance: Array<SmsBalance>;
    @Input() pagination: any;
    @Input() spinner: boolean;
    @Input() selectedSmsBalance: SmsBalance;
    public table: TableConfig = TABLE_SMS_BALANCE;

    constructor(
        public toastService: ToastrService,
        private sharedDataService: SharedDataService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private ngbModal: NgbModal,
        private clipboardService: ClipboardService
    ) {}

    public copyData(
        selectedDetailsSmsBalance: SmsBalance,
        type: TYPECOPY
    ): void {
        this.toastService.success('Copié dans le presse papier');
        this.clipboardService.copyFromContent(selectedDetailsSmsBalance[type]);
    }

    public pageCallback() {
        this.sharedDataService.sendPatrimoineSmsBalance();
    }

    public onExportExcel(): void {
        this.tableExportExcelFileService.exportAsExcelFile(
            this.listSmsBalance,
            this.table,
            'liste_solde_sms'
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
        this.selectSmsBalance(params.data);
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

    public showJournal(selectedSmsBalance: Object): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.typeJournal = 'smsBalance';
        modalRef.componentInstance.numero_demande =
            selectedSmsBalance['reference'];
    }

    private selectSmsBalance(selectedSmsBalance: SmsBalance): void {
        this.selectedSmsBalance = selectedSmsBalance;
    }
}
