import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Router } from '@angular/router';
import { StoreCurrentUserService } from '../../services/store-current-user.service';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OVERSEEING_OPERATIONS } from '../../routes/routes';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { EncodingDataService } from '../../services/encoding-data.service';
SwiperCore.use([Navigation, Pagination, Autoplay]);
const NOTIFICATIONS_ROUTE = 'notifications';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    public logoTenant: string;
    public nom_tenant: string;
    public soldeGlobal: string;
    public ligneCreditGlobal: string;
    public notificationCount$: Observable<number>;
    private destroy$ = new Subject<void>();

    constructor(
        public layout: LayoutService,
        public navServices: NavService,
        private router: Router,
        private sharedService: SharedService,
        private encodingService: EncodingDataService
    ) {
        this.sharedService.fetchUnReadNotifications();
        this.notificationCount$ =
            this.sharedService.getApiResponseUnReadNotifications();
        this.statutLayout();
    }

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.nom_tenant = user?.tenant.nom_tenant as string;
        this.logoTenant = `${user?.tenant?.url_minio}/${user?.tenant?.logo_tenant}`;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public handleRefreshNotification(): void {
        this.sharedService.fetchUnReadNotifications();
    }

    OnGoNotif() {
        this.router.navigateByUrl(
            `${OVERSEEING_OPERATIONS}/${NOTIFICATIONS_ROUTE}`
        );
    }

    public pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    statutLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona' ? true : false;
    }
}
