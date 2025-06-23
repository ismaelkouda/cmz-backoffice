import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TypeAlarme } from '../../../../../shared/enum/TypeAlarme.enum';
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
    public listTypeNotifications: Array<TypeAlarme> = [];

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private notificationsCenterApiService: NotificationsCenterApiService
    ) {
        this.sharedService.fetchNotification();
        this.notificationsCenterApiService.fetchReadAllNotifications();
        Object.values(TypeAlarme).forEach((item) => {
            this.listTypeNotifications.push(item);
        });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[3];
        });
        this.notificationCount$ =
            this.sharedService.getApiResponseUnReadNotifications();
        this.notificationList$ = this.sharedService.getNotificationList();
        this.notificationPagination$ =
            this.sharedService.getNotificationPagination();
    }

    public onPageChange(event: number): void {
        this.sharedService.fetchNotification(JSON.stringify(event + 1));
    }
}
