/* import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BreadcrumbComponent } from 'shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { SharedService } from '../../../../../shared/services/shared.service';
import { NotificationsCenterApiService } from '../../data-access/notifications-center/services/notifications-center-api.service';
import { notificationsFilterEntity } from '../../domain/entities/notifications-filter.entity';
import {
    notificationsApiResponseEntity,
    notificationsEntity,
} from '../../domain/entities/notifications.entity';
import { TableNotificationsCenterComponent } from '../../feature/notifications-center/table-notifications-center/table-notifications-center.component';

@Component({
    selector: 'app-notifications-center',
    templateUrl: './notifications-center.component.html',
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TableNotificationsCenterComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
})
export class NotificationsCenterComponent implements OnInit {
    public module!: string;
    public subModule!: string;
    public filterData!: notificationsFilterEntity;
    public notificationCount$!: Observable<number>;
    public notificationList$!: Observable<notificationsEntity[]>;
    public notificationPagination$!: Observable<
        Paginate<notificationsApiResponseEntity>
    >;
    public spinner = false;
    public listTypeNotifications: any[] = [];

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private notificationsCenterApiService: NotificationsCenterApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][3];
        });
        this.sharedService.fetchNotification();
        this.notificationList$ = this.sharedService.getNotificationList();
        this.notificationPagination$ =
            this.sharedService.getNotificationPagination();

        this.notificationsCenterApiService.fetchReadAllNotifications();
        this.notificationCount$ =
            this.sharedService.getApiResponseUnReadNotifications();
    }

    public onPageChange(event: number): void {
        this.sharedService.fetchNotification(JSON.stringify(event + 1));
    }
}
 */
