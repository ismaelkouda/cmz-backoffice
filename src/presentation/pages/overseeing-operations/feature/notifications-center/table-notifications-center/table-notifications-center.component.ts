import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { combineLatest, Observable } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { notificationsCenterTableConstant } from "../../../data-access/notifications-center/constants/notifications-center-table.constant";
import { notificationsCenterInterface } from "../../../data-access/notifications-center/interfaces/notifications-center.interface";
import { notificationsCenterFilterInterface } from "../../../data-access/notifications-center/interfaces/notifications-center-filter.interface";
import { NotificationsCenterApiService } from "../../../data-access/notifications-center/services/notifications-center-api.service";
import { handle } from "../../../../../../shared/functions/api.function";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: `app-table-notifications-center`,
  templateUrl: `./table-notifications-center.component.html`
})

export class TableNotificationsCenterComponent {

  @Input() listNotifications$: Observable<Array<notificationsCenterInterface>>;
  @Input() pagination$: Observable<Paginate<notificationsCenterInterface>>;
  public table: TableConfig = notificationsCenterTableConstant;
  public selectedNotifications: Array<notificationsCenterInterface> = [];

  constructor(public toastService: ToastrService, private notificationsCenterApiService: NotificationsCenterApiService,
    private tableExportExcelFileService: TableExportExcelFileService, private translate: TranslateService,
    private clipboardService: ClipboardService, private loadingBarService: LoadingBarService,
    private sanitizer: DomSanitizer) { }

  public copyToClipboard(data: string): void {
    const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
    this.toastService.success(translatedMessage);
    this.clipboardService.copyFromContent(data);
  }

  public getSanitizedHTML(content: string): SafeHtml {
    console.log('content', content)
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  async onClearNotificationSelected(): Promise<void> {
    const response: any = await handle(() => this.notificationsCenterApiService.deleteNotificationsSelected({ notifications: this.selectedNotifications.map(notif => notif?.id) }), this.toastService, this.loadingBarService);
    if (response.error === false) {
      this.toastService.success(response?.message);
      this.selectedNotifications = [];
      combineLatest([
        this.notificationsCenterApiService.getDataFilterNotificationsCenter(),
        this.notificationsCenterApiService.getDataNbrPageNotificationsCenter()
      ]).subscribe(([filterData, nbrPageData]) => {
        this.notificationsCenterApiService.fetchNotificationsCenter(filterData, nbrPageData);
      });
      // this.saveNumberNotifications(response);
    }
  }

  // private saveNumberNotifications(response): void {
  //     this.listenerEmitterDataNumberNotificationsService.emitStartedNumberNotifications(
  //       response.data?.notifications
  //     );
  // }

  public pageCallback() {
    this.notificationsCenterApiService.fetchNotificationsCenter({} as notificationsCenterFilterInterface);
  }

  public onExportExcel(): void {
    this.listNotifications$.subscribe(data => {
      if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "lis_notifications_center"); }
    });
  }

}