import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { Observable, take } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { notificationsCenterTableConstant } from '../../../data-access/notifications-center/constants/notifications-center-table.constant';
import {
    notificationsCenterApiResponseInterface,
    notificationsCenterInterface,
} from '../../../data-access/notifications-center/interfaces/notifications-center.interface';
import { NotificationsCenterApiService } from '../../../data-access/notifications-center/services/notifications-center-api.service';
import { handle } from '../../../../../../shared/functions/api.function';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SharedService } from '../../../../../../shared/services/shared.service';
import {
    OperationTransaction,
    TitleOperation,
} from '../../../../../../shared/enum/OperationTransaction.enum';

@Component({
    selector: `app-table-notifications-center`,
    templateUrl: `./table-notifications-center.component.html`,
})
export class TableNotificationsCenterComponent {
    @Input() notificationPagination$: Observable<
        Paginate<notificationsCenterApiResponseInterface>
    >;
    @Input() notificationList$: Observable<Array<notificationsCenterInterface>>;
    @Input() spinner: boolean;
    public selectedNotifications: Array<notificationsCenterInterface> = [];
    public table: TableConfig = notificationsCenterTableConstant;

    constructor(
        public toastService: ToastrService,
        private sharedService: SharedService,
        private notificationsCenterApiService: NotificationsCenterApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private clipboardService: ClipboardService,
        private loadingBarService: LoadingBarService,
        private sanitizer: DomSanitizer
    ) {}

    public onExportExcel(): void {
        this.notificationList$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_notifications'
                );
            }
        });
    }

    public pageCallback() {
        this.sharedService.fetchNotification();
        this.selectedNotifications = [];
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }

    public getSanitizedHTML(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    async handleClearNotification(): Promise<void> {
        if (this.selectedNotifications.length === 0) return;
        const response: any = await handle(
            () =>
                this.notificationsCenterApiService.ReadNotifications({
                    notifications: this.selectedNotifications.map(
                        (notif) => notif?.id
                    ),
                }),
            this.toastService,
            this.loadingBarService
        );
        if (response.error === false) this.handleSuccessful(response);
    }

    private handleSuccessful(response): void {
        this.toastService.success(response?.message);
        this.selectedNotifications = [];
        this.sharedService.fetchNotification();
    }
}
