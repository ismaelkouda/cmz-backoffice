import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import {
    notificationsCenterApiResponseInterface,
    notificationsCenterInterface,
} from '../../data-access/notifications-center/interfaces/notifications-center.interface';
import { notificationsCenterFilterInterface } from '../../data-access/notifications-center/interfaces/notifications-center-filter.interface';
import { NotificationsCenterApiService } from '../../data-access/notifications-center/services/notifications-center-api.service';
import { SharedService } from '../../../../../shared/services/shared.service';

@Component({
    selector: 'app-notifications-center',
    templateUrl: './notifications-center.component.html',
})
export class NotificationsCenterComponent implements OnInit {
    public module: string;
    public subModule: string;
    public filterData: notificationsCenterFilterInterface;
    public notificationCount$: Observable<number>;
    public notificationList$: Observable<Array<notificationsCenterInterface>>;
    public notificationPagination$: Observable<
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
            this.module = data.module;
            this.subModule = data.subModule[3];
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
