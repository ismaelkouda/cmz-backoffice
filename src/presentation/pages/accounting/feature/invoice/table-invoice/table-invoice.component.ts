import { InvoiceApiService } from './../../../data-access/invoice/services/invoice-api.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { invoiceTableConstant } from '../../../data-access/invoice/constants/invoice-table.constant';
import { TranslateService } from '@ngx-translate/core';
import { invoiceFilterInterface } from '../../../data-access/invoice/interfaces/invoice-filter.interface';

type Action = ModalAction;
type ModalAction = { data: Folder, action: 'view-invoice', view: 'page' };
type TYPE_COLOR_ETAPE_BADGE = 'badge-dark' | 'badge-warning' | 'badge-info' | 'badge-success';
type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-invoice',
    templateUrl: './table-invoice.component.html'
})

export class TableInvoiceComponent {

    @Input() listInvoices$: Observable<Array<Folder>>;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Input() spinner: boolean;
    @Output() interfaceUser = new EventEmitter<any>();
    public invoiceSelected: Folder;
    public visibleFormInvoice = false;

    public readonly table: TableConfig = invoiceTableConstant;
    public readonly BADGE_STATUS_INVOICE = BADGE_STATUS_INVOICE;

    constructor(private toastService: ToastrService, private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService, private translate: TranslateService,
        private invoiceApiService: InvoiceApiService) { }

    public onExportExcel(): void {
        this.listInvoices$.subscribe(data => {
            if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "List_invoice"); }
        });
    }

    public pageCallback() {
        this.invoiceApiService.fetchInvoice({} as invoiceFilterInterface);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStatusInvoiceBadge(selectedInvoice?: { statut: T_BADGE_STATUS_INVOICE; }): TYPE_COLOR_ETAPE_BADGE {
        if (!selectedInvoice || !selectedInvoice.statut) {
            return 'badge-dark';
          }
      
          const stateMap: Record<T_BADGE_STATUS_INVOICE, TYPE_COLOR_ETAT_BADGE> = {
            [BADGE_STATUS_INVOICE.EN_ATTENTE]: 'badge-dark',
            [BADGE_STATUS_INVOICE.POSTEE]: 'badge-warning',
            [BADGE_STATUS_INVOICE.REPORTEE]: 'badge-primary',
            [BADGE_STATUS_INVOICE.SOLDEE]: 'badge-success',
            [BADGE_STATUS_INVOICE.REJETEE]: 'badge-danger',
          };
      
          return stateMap[selectedInvoice.statut];
    }

    public handleAction(params: Action): void {
        this.onSelectInvoice(params.data);

        switch (params.view) {
            case 'page': this.interfaceUser.emit(params); break; break;
        }
    }

    getTreatmentButtonViewStyle(selectedInvoice: { type_paiement: any, etat_facture: string }): { style: string, value: string } {
        if (!!selectedInvoice?.["type_paiement"]) {
            return { style: 'badge-success', value: selectedInvoice?.["etat_facture"] };
          } else {
            return { style: 'badge-danger', value: selectedInvoice?.["etat_facture"] };
          }
    }

    private onSelectInvoice(selectedInvoice: Folder): void {
        this.invoiceSelected = selectedInvoice;
        this.invoiceApiService.setInvoiceSelected(selectedInvoice);
    }

    public hideDialog(): void {
        this.visibleFormInvoice = false;
    }
}
