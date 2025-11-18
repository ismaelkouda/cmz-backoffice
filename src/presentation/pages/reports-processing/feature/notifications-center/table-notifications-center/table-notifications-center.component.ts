/* import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, take } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { SharedService } from '../../../../../../shared/services/shared.service';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { NotificationsCenterApiService } from '../../../data-access/notifications-center/services/notifications-center-api.service';
import { NOTIFICATIONS_TABLE_CONST } from '../../../domain/constants/notifications-table.constant';
import {
    notificationsApiResponseEntity,
    notificationsEntity,
} from '../../../domain/entities/notifications.entity';

@Component({
    selector: `app-table-notifications-center`,
    standalone: true,
    templateUrl: `./table-notifications-center.component.html`,
    styleUrls: [`./table-notifications-center.component.scss`],
    imports: [
        CommonModule,
        AsyncPipe,
        TableModule,
        TooltipModule,
        ProgressSpinnerModule,
    ],
})
export class TableNotificationsCenterComponent {
    @Input() notificationPagination$!: Observable<
        Paginate<notificationsApiResponseEntity>
    >;
    @Input() notificationList$!: Observable<notificationsEntity[]>;
    @Input() spinner!: boolean;
    public selectedNotifications: notificationsEntity[] = [];
    public table: TableConfig = NOTIFICATIONS_TABLE_CONST;

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

    public getTitleForm(operation: string): string {
        return '';
    }

    public getSanitizedHTML(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    async handleClearNotification(): Promise<void> {
        if (this.selectedNotifications.length === 0) {
            return;
        }
        // const response: any = await handle(
        //     () =>
        //         this.notificationsCenterApiService.ReadNotifications({
        //             notifications: this.selectedNotifications.map(
        //                 (notif) => notif?.id
        //             ),
        //         }),
        //     this.toastService,
        //     this.loadingBarService
        // );
        // if (response.error === false) this.handleSuccessful(response);
    }
}
 */
