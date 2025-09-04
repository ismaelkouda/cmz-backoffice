import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceInterface } from '../../../data-access/invoice/interface/invoice.interface';
import { invoiceTableConstant } from '../../../data-access/invoice/constantes/invoice-table';
import { InvoiceApiService } from '../../../data-access/invoice/service/invoice-api.service';
import {
    INVOICE_STATE_ENUM,
    T_INVOICE_STATE_ENUM,
} from '../../../data-access/invoice/enums/invoice-state.enum';
import { INVOICE_BUTTONS_ACTIONS_ENUM } from '../../../data-access/invoice/enums/invoice-buttons-actions.enum';
import { InvoicePageActionsType } from '../../../data-access/invoice/types/invoice-page-actions.type';
import { InvoiceFilterInterface } from '../../../data-access/invoice/interface/invoice-filter.interface';

type TYPE_COLOR_STATE_BADGE =
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
    @Output() interfaceUser = new EventEmitter<InvoicePageActionsType>();

    @Input() spinner: boolean;
    @Input() listInvoices$: Observable<Array<InvoiceInterface>> =
        new BehaviorSubject<Array<InvoiceInterface>>([]);
    @Input() pagination$: Observable<Paginate<InvoiceInterface>>;

    public invoiceSelected: InvoiceInterface;
    public readonly table: TableConfig = invoiceTableConstant;
    private destroy$ = new Subject<void>();

    public INVOICE_BUTTONS_ACTIONS_ENUM = INVOICE_BUTTONS_ACTIONS_ENUM;
    public readonly INVOICE_STATE_ENUM = INVOICE_STATE_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private invoiceApiService: InvoiceApiService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.invoiceApiService.fetchInvoice(
            {} as InvoiceFilterInterface
        );
    }

    public onExportExcel(): void {
        this.invoiceApiService
            .getInvoice()
            .pipe(take(1))
            .subscribe((invoice) => {
                if (invoice) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        invoice,
                        this.table,
                        'List_invoices'
                    );
                } else {
                    this.toastService.error(
                        this.translate.instant('NO_DATA_TO_EXPORT')
                    );
                }
            });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStateBadge(selectedInvoice?: {
        statut: T_INVOICE_STATE_ENUM;
    }): TYPE_COLOR_STATE_BADGE {
        if (!selectedInvoice || !selectedInvoice.statut) {
            return 'badge-dark';
        }

        const stateMap: Record<T_INVOICE_STATE_ENUM, TYPE_COLOR_STATE_BADGE> = {
            [INVOICE_STATE_ENUM.WAITING]: 'badge-dark',
            [INVOICE_STATE_ENUM.POSTED]: 'badge-warning',
            [INVOICE_STATE_ENUM.REPORTED]: 'badge-primary',
            [INVOICE_STATE_ENUM.RESULTED]: 'badge-success',
            [INVOICE_STATE_ENUM.REJECTED]: 'badge-danger',
            [INVOICE_STATE_ENUM.NON_SOLDEE]: 'badge-danger',
        };

        return stateMap[selectedInvoice.statut];
    }

    public handleAction(params: InvoicePageActionsType): void {
        this.onSelectInvoice(params.data);

        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    handleActionButtonViewStyle(selectedInvoice: {
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

    private onSelectInvoice(selectedInvoice: InvoiceInterface): void {
        this.invoiceSelected = selectedInvoice;
    }
}
