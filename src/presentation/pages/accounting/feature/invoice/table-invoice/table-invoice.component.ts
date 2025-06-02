import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { invoiceInterface } from '../../../data-access/invoice/interface/invoice.interface';
import { invoiceTableConstant } from '../../../data-access/invoice/constantes/invoice-table';
import { InvoiceApiService } from '../../../data-access/invoice/service/invoice-api.service';
import { invoiceFilterInterface } from '../../../data-access/invoice/interface/invoice-filter.interface';
import {
    INVOICE_STATUS_ENUM,
    T_INVOICE_STATUS_ENUM,
} from '../../../data-access/invoice/enums/invoice-status.enum';
import {
    OperationTransaction,
    TitleOperation,
} from '../../../../../../shared/enum/OperationTransaction.enum';

type Action = PageAction;
type PageAction = {
    data: invoiceInterface;
    action: 'view-invoice';
    view: 'page';
};
type TYPE_COLOR_INVOICE_STATUS_BADGE =
    | 'badge-dark'
    | 'badge-warning'
    | 'badge-primary'
    | 'badge-success'
    | 'badge-danger';

@Component({
    selector: 'app-table-invoice',
    templateUrl: './table-invoice.component.html',
})
export class TableInvoiceComponent {
    @Input() listInvoices$: Observable<Array<invoiceInterface>>;
    @Input() pagination$: Observable<Paginate<invoiceInterface>>;
    @Input() spinner: boolean;
    @Output() interfaceUser = new EventEmitter<Action>();
    public invoiceSelected: invoiceInterface;
    public visibleFormInvoice = false;

    public readonly table: TableConfig = invoiceTableConstant;
    public readonly INVOICE_STATUS_ENUM = INVOICE_STATUS_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private invoiceApiService: InvoiceApiService
    ) {}

    public onExportExcel(): void {
        this.listInvoices$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_invoice'
                );
            }
        });
    }

    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }

    public pageCallback() {
        this.invoiceApiService.fetchInvoice({} as invoiceFilterInterface);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStatusInvoiceBadge(selectedInvoice?: {
        statut: T_INVOICE_STATUS_ENUM;
    }): TYPE_COLOR_INVOICE_STATUS_BADGE {
        if (!selectedInvoice || !selectedInvoice.statut) {
            return 'badge-dark';
        }

        const stateMap: Record<
            T_INVOICE_STATUS_ENUM,
            TYPE_COLOR_INVOICE_STATUS_BADGE
        > = {
            [INVOICE_STATUS_ENUM.WAITING]: 'badge-dark',
            [INVOICE_STATUS_ENUM.POSTED]: 'badge-warning',
            [INVOICE_STATUS_ENUM.REPORTED]: 'badge-primary',
            [INVOICE_STATUS_ENUM.RESULTED]: 'badge-success',
            [INVOICE_STATUS_ENUM.REJECTED]: 'badge-danger',
            [INVOICE_STATUS_ENUM.NON_SOLDEE]: 'badge-danger',
        };

        return stateMap[selectedInvoice.statut];
    }

    public handleAction(params: Action): void {
        this.onSelectInvoice(params.data);

        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    getTreatmentButtonViewStyle(selectedInvoice: {
        type_paiement: any;
        etat_facture: string;
    }): { style: string; value: string } {
        if (!!selectedInvoice?.['type_paiement']) {
            return {
                style: 'badge-success',
                value: selectedInvoice?.['etat_facture'],
            };
        } else {
            return {
                style: 'badge-danger',
                value: selectedInvoice?.['etat_facture'],
            };
        }
    }

    private onSelectInvoice(selectedInvoice: invoiceInterface): void {
        this.invoiceSelected = selectedInvoice;
        this.invoiceApiService.setInvoiceSelected(selectedInvoice);
    }

    public hideDialog(): void {
        this.visibleFormInvoice = false;
    }
}
