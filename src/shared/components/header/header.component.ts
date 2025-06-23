import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
// @ts-ignore
import { Router } from '@angular/router';
import { StoreCurrentUserService } from '../../services/store-current-user.service';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { SharedService } from '../../services/shared.service';
import { Observable } from 'rxjs';
import { OVERSEEING_OPERATIONS } from '../../routes/routes';
SwiperCore.use([Navigation, Pagination, Autoplay]);
const NOTIFICATIONS_ROUTE = 'notifications';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    public elem: any;
    public profil: any;
    public logoTenant: string;
    public minioUrl: string;
    public nom_tenant: string;
    public soldeGlobal: string;
    public ligneCreditGlobal: string;
    public notificationCount$: Observable<number>;

    constructor(
        public layout: LayoutService,
        public navServices: NavService,
        private router: Router,
        private sharedService: SharedService,
        private storeCurrentUserService: StoreCurrentUserService
    ) {
        this.sharedService.fetchUnReadNotifications();
        this.notificationCount$ =
            this.sharedService.getApiResponseUnReadNotifications();
        const currentUser: CurrentUser | null =
            this.storeCurrentUserService.getCurrentUser;
        this.nom_tenant = currentUser?.tenant.nom_tenant as string;
        this.logoTenant = `${currentUser?.tenant?.url_minio}/${currentUser?.tenant?.logo_tenant}`;
        this.statutLayout();
    }

    ngOnInit() {
        this.elem = document.documentElement;
        // this.mappingService.volumeDataGlobal$.subscribe((res: any) => {
        //     this.soldeGlobal = res;
        // });
        // this.mappingService.ligneCreditGlobal$.subscribe((res: any) => {
        //     this.ligneCreditGlobal = res;
        // });
        // this.notifyService.onData().subscribe((data: any) => {
        //     this.OncountNotify();
        // });
    }
    // public OncountNotify() {
    //     this.notifyService.OncountNotify().subscribe({
    //         next: (response) => {

    //             let user = JSON.parse(this.storage.getData('user'));
    //             this.countNotify = response['data'];
    //             user.notifications = response['data'];
    //             this.storage.saveData('user', JSON.stringify(user));
    //             this.toastrService.success(response['message']);
    //         },
    //         error: (error) => {
    //             this.toastrService.error(error.error.message);
    //         },
    //     });
    // }

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
