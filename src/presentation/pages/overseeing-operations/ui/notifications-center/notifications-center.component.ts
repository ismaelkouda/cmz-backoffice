import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable } from 'rxjs';
import { TypeAlarme } from '../../../../../shared/enum/TypeAlarme.enum';
import { notificationsCenterInterface } from '../../data-access/notifications-center/interfaces/notifications-center.interface';
import { notificationsCenterFilterInterface } from '../../data-access/notifications-center/interfaces/notifications-center-filter.interface';
import { NotificationsCenterApiService } from '../../data-access/notifications-center/services/notifications-center-api.service';

@Component({
    selector: "app-notifications-center",
    templateUrl: "./notifications-center.component.html"
})

export class NotificationsCenterComponent implements OnInit {

    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<notificationsCenterInterface>>;
    public filterData: notificationsCenterFilterInterface;
    public listNotifications$: Observable<Array<notificationsCenterInterface>>;
    public listTypeNotifications: Array<TypeAlarme> = [];

    constructor(private activatedRoute: ActivatedRoute,
        private notificationsCenterApiService: NotificationsCenterApiService) {
        Object.values(TypeAlarme).forEach(item => { this.listTypeNotifications.push(item); });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[3];
        });
        this.listNotifications$ = this.notificationsCenterApiService.getNotificationsCenter();
        this.pagination$ = this.notificationsCenterApiService.getNotificationsCenterPagination();
        combineLatest([
            this.notificationsCenterApiService.getDataFilterNotificationsCenter(),
            this.notificationsCenterApiService.getDataNbrPageNotificationsCenter()
        ]).subscribe(([filterData, nbrPageData]) => {
            this.notificationsCenterApiService.fetchNotificationsCenter(filterData, nbrPageData);
        });
    }

    public filter(filterData: notificationsCenterFilterInterface): void {
        this.filterData = filterData;
        this.notificationsCenterApiService.fetchNotificationsCenter(filterData)
    }

    public onPageChange(event: number): void {
        this.notificationsCenterApiService.fetchNotificationsCenter(this.filterData, JSON.stringify(event + 1))
    }

}