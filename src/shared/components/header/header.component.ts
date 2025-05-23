import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
// @ts-ignore
import { Router } from '@angular/router';
import { NOTIFY_ROUTE } from 'src/presentation/pages/supervision-operations/supervision-operations-routing.module';
import { SUPERVISION_OPERATIONS } from 'src/shared/routes/routes';
import { StoreLocaleService } from 'src/shared/services/store-locale.service';
import { StoreCurrentUserService } from '../../services/store-current-user.service';
import { MappingService } from '../../services/mapping.service';
import { CurrentUser } from '../../interfaces/current-user.interface';
SwiperCore.use([Navigation, Pagination, Autoplay]);

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
    public countNotify: number = 0;

    constructor(
        public layout: LayoutService,
        public navServices: NavService,
        private mappingService: MappingService,
        private router: Router,
        private storeLocaleService: StoreLocaleService,
        private storeCurrentUserService: StoreCurrentUserService
    ) {
        const currentUser: CurrentUser | null =
            this.storeCurrentUserService.getCurrentUser;
        this.nom_tenant = currentUser?.tenant.nom_tenant as string;
        this.logoTenant = `${currentUser?.tenant?.url_minio}/${currentUser?.tenant?.logo_tenant}`;
        this.statutLayout();
        this.storeLocaleService._notify$.subscribe((res: any) => {
            if (res) {
                this.countNotify = res;
            } else {
                if (currentUser !== null) {
                    this.countNotify = currentUser.notifications;
                } else {
                    this.countNotify = currentUser?.notifications;
                }
            }
        });
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
    //             console.log('response', response);

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

    OnGoNotif() {
        this.router.navigateByUrl(`${SUPERVISION_OPERATIONS}/${NOTIFY_ROUTE}`);
    }

    public pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    statutLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona' ? true : false;
    }
}
