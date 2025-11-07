import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { OVERSEEING_OPERATIONS } from '../../routes/routes';
import { EncodingDataService } from '../../services/encoding-data.service';
import { LayoutService } from '../../services/layout.service';
import { NavService } from '../../services/nav.service';
import { SharedService } from '../../services/shared.service';
import { MyAccountComponent } from './elements/my-account/my-account.component';
const NOTIFICATIONS_ROUTE = 'notifications';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [MyAccountComponent],
})
export class HeaderComponent implements OnDestroy {
    public soldeGlobal!: string;
    public ligneCreditGlobal!: string;
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
        this.statusLayout();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public handleRefreshNotification(): void {
        this.sharedService.fetchUnReadNotifications();
    }

    OnGoNotifications() {
        this.router.navigateByUrl(
            `${OVERSEEING_OPERATIONS}/${NOTIFICATIONS_ROUTE}`
        );
    }

    public pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    statusLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona';
    }
}
