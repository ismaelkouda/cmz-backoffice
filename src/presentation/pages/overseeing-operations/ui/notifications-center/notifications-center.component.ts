import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BreadcrumbComponent } from 'shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { SharedService } from '../../../../../shared/services/shared.service';
import { notificationsCenterFilterInterface } from '../../data-access/notifications-center/interfaces/notifications-center-filter.interface';
import {
    notificationsCenterApiResponseInterface,
    notificationsCenterInterface,
} from '../../data-access/notifications-center/interfaces/notifications-center.interface';
import { NotificationsCenterApiService } from '../../data-access/notifications-center/services/notifications-center-api.service';
import { TableNotificationsCenterComponent } from '../../feature/notifications-center/table-notifications-center/table-notifications-center.component';

@Component({
    selector: 'app-notifications-center',
    templateUrl: './notifications-center.component.html',
    imports: [
        BreadcrumbComponent,
        PatrimoineHeaderComponent,
        TableNotificationsCenterComponent,
        ParginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
})
export class NotificationsCenterComponent implements OnInit {
    public module!: string;
    public subModule!: string;
    public filterData!: notificationsCenterFilterInterface;
    public notificationCount$!: Observable<number>;
    public notificationList$!: Observable<Array<notificationsCenterInterface>>;
    public notificationPagination$!: Observable<
        Paginate<notificationsCenterApiResponseInterface>
    >;
    public spinner: boolean = false;
    public listTypeNotifications: Array<any> = [];

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
