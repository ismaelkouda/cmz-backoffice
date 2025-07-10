import { Input, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { Observable, Subject, takeUntil } from 'rxjs';
import { dataBalanceStatusInterface } from '../../../data-access/data-balance-status/interfaces/data-balance-status.interface';
import { dataBalanceStatusApiService } from '../../../data-access/data-balance-status/services/data-balance-status-api.service';
import { dataBalanceStatusFilterInterface } from '../../../data-access/data-balance-status/interfaces/data-balance-status-filter.interface';
import { dataBalanceStatusTableConstant } from '../../../data-access/data-balance-status/constants/data-balance-status-table.constant';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';
import { CurrentUser } from '../../../../../../shared/interfaces/current-user.interface';

@Component({
    selector: `app-table-data-balance-status`,
    templateUrl: `./table-data-balance-status.component.html`,
    styles: [
        `
            ::ng-deep .p-datatable-wrapper {
                overflow-x: auto;
            }

            ::ng-deep
                .p-datatable-scrollable
                .p-datatable-thead
                > tr
                > th:last-child {
                display: flex;
                justify-content: center;
            }
        `,
    ],
})
export class TableDataBalanceStatusComponent implements OnInit, OnDestroy {
    @Input() spinner: boolean;
    @Input() listDataBalanceStatus$: Observable<
        Array<dataBalanceStatusInterface>
    >;
    @Input() pagination$: Observable<Paginate<dataBalanceStatusInterface>>;
    public table: TableConfig = dataBalanceStatusTableConstant;

    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;
    private destroy$ = new Subject<void>();

    constructor(
        public toastService: ToastrService,
        private dataBalanceStatusApiService: dataBalanceStatusApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private clipboardService: ClipboardService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.firstLevelLibel = user?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel = user?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel = user?.structure_organisationnelle?.niveau_3;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public pageCallback() {
        this.dataBalanceStatusApiService.fetchDataBalanceStatus(
            {} as dataBalanceStatusFilterInterface
        );
    }

    public onExportExcel(): void {
        this.listDataBalanceStatus$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'liste_etat_des_soldes_data'
                );
            }
        });
    }
}
