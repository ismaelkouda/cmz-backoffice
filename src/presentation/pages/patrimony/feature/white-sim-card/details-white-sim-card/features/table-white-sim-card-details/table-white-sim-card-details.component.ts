import { whiteSimCardDetailsTableConstant } from './../../../../../data-access/white-sim-card/constants/white-sim-card-details.table.constant';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../../../shared/services/table-export-excel-file.service';
import { Observable, take } from 'rxjs';
import { whiteSimCardDetailsInterface } from '../../../../../data-access/white-sim-card/interfaces/white-sim-card-details.interface';
import { whiteSimCardApiService } from '../../../../../data-access/white-sim-card/services/white-sim-card-api.service';
import { whiteSimCardDetailsFilterInterface } from '../../../../../data-access/white-sim-card/interfaces/white-sim-card-details-filter.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-table-white-sim-card-details',
    templateUrl: './table-white-sim-card-details.component.html',
})
export class TableWhiteSimCardDetailsComponent {
    @Input() listWhiteSimCardDetails$: Observable<
        Array<whiteSimCardDetailsInterface>
    >;
    @Input() spinner: boolean;
    @Input() urlParamRef: string;
    @Input() urlParamId: number;
    public table: TableConfig = whiteSimCardDetailsTableConstant;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private translate: TranslateService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private whiteSimCardApiService: whiteSimCardApiService
    ) {}

    public getStatutBadge(statut: string): string {
        switch (statut) {
            case 'disponible':
                return 'badge-success';

            case 'attribué':
                return 'badge-warning';

            case 'reservé':
                return 'badge-secondary';
        }
        return 'badge-dark';
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public pageCallback() {
        this.whiteSimCardApiService.fetchWhiteSimCardDetails({
            id: this.urlParamId,
        });
    }

    public onExportExcel(): void {
        this.listWhiteSimCardDetails$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    `liste_white_card_sim_details${this.urlParamRef}`
                );
            }
        });
    }
}
