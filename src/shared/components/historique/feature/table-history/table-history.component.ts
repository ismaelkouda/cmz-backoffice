import { Component, Input } from '@angular/core';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../services/table-export-excel-file.service';
import { historyTableConstant } from '../../data-access/constants/history-table.constant';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { HistoryApiService } from '../../data-access/services/history-api.service';
import { combineLatest, Observable } from 'rxjs';
import { Paginate } from '@shared/interfaces/paginate';
import { historyInterface } from '../../data-access/interfaces/history.interface';

type Action = ModalAction;
type ModalAction = { data: any; action: 'view-history'; view: 'modal' };

@Component({
    selector: 'app-table-history',
    templateUrl: './table-history.component.html',
})
export class TableHistoryComponent {
    @Input() listHistory$: Observable<Array<historyInterface>>;
    @Input() pagination$: Observable<Paginate<historyInterface>>;
    @Input() idModel: number;
    @Input() typeModel: string;
    @Input() historySelected: any;
    public visibleDetailsHistory = false;
    public readonly table: TableConfig = historyTableConstant;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private historyApiService: HistoryApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    public pageCallback() {
        combineLatest([
            this.historyApiService.getDataFilterHistory(),
            this.historyApiService.getDataNbrPageHistory(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.historyApiService.fetchHistory(filterData, nbrPageData);
        });
    }

    public onExportExcel(): void {
        this.listHistory$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'list_histories'
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

    public handleAction(params: Action): void {
        switch (params.view) {
            case 'modal':
                if (params.action === 'view-history') {
                    this.handleDetailsHistory(params.data);
                }
                break;
        }
    }

    handleDetailsHistory(history: any): void {
        this.onSelectHistory(history);
        this.visibleDetailsHistory = true;
    }

    private onSelectHistory(historySelected: any): void {
        this.historySelected = historySelected;
        this.historyApiService.setHistorySelected(historySelected);
    }

    hideDialog(): void {
        this.visibleDetailsHistory = false;
    }
}
