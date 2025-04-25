import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { LOGO_ORANGE } from 'src/shared/constants/logoOrange.constant';
import { CryptoSidebar } from '../../crypto-data/crypto-sidebar';
import { CryptoToken } from '../../crypto-data/crypto-token';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
    public LOGO_ORANGE = LOGO_ORANGE;
    public iconSidebar;
    public menuItems: Array<any>;
    public filterArray: Array<any> = [];
    public filterArray2: Array<any> = [];

    public url: any;
    public fileurl: any;

    // For Horizontal Menu
    public margin: any = 0;
    public width: any = window.innerWidth;
    public leftArrowNone: boolean = true;
    public rightArrowNone: boolean = false;
    public currentUser: any;
    public data: any = [];

    constructor(
        private router: Router,
        public navServices: NavService,
        public layout: LayoutService,
        private storage: EncodingDataService,
        private toastrService: ToastrService,
        private cryptoToken: CryptoToken,
        private cryptoSidebar: CryptoSidebar
    ) {
        this.menuItems = JSON.parse(this.storage.getData('menu')) ?? [];
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.menuItems.filter((items) => {
                    if (items.path === event.url) {
                        this.setNavActive(items);
                    }
                    if (!items.children) {
                        return false;
                    }
                    items.children.filter((subItems) => {
                        if (subItems.path === event.url) {
                            this.setNavActive(subItems);
                        }
                        if (!subItems.children) {
                            return false;
                        }
                        subItems.children.filter((subSubItems) => {
                            if (subSubItems.path === event.url) {
                                this.setNavActive(subSubItems);
                            }
                        });
                    });
                });
            }
        });
    }
    // async getDecryptedSidebar(): Promise<string> {
    //     try {
    //         const token = await this.getDecryptedToken();
    //         const sidebarData = await this.cryptoSidebar.getSidebarData('sidebar', token);

    //         if (!sidebarData) {
    //             throw new Error('Impossible de récupérer votre session. Veuillez vous reconnecter.');
    //         }

    //         return sidebarData;

    //     } catch (error) {
    //         console.error('Aucune données disponible pour la sidebar ou déchiffrement échoué');
    //         this.toastrService.error(error);
    //         throw error;
    //     }
    // }
    // async getDecryptedToken(): Promise<string> {
    //     try {
    //         const token = await this.cryptoToken.getTokenData('token');

    //         if (!token) {
    //           return '';
    //             // throw new Error('Impossible de récupérer votre session. Veuillez vous reconnecter.');
    //         }

    //         return token;

    //     } catch (error) {
    //         console.error('Aucun token disponible ou déchiffrement échoué');
    //         this.toastrService.error(error);
    //         this.router.navigate(['/auth/login']);
    //         throw error;
    //     }
    // }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.width = event.target.innerWidth - 500;
    }

    sidebarToggle() {
        this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    }

    // Active Nave state
    setNavActive(item) {
        this.menuItems.filter((menuItem) => {
            if (menuItem !== item) {
                menuItem.active = false;
            }
            if (menuItem.children && menuItem.children.includes(item)) {
                menuItem.active = true;
            }
            if (menuItem.children) {
                menuItem.children.filter((submenuItems) => {
                    if (
                        submenuItems.children &&
                        submenuItems.children.includes(item)
                    ) {
                        menuItem.active = true;
                        submenuItems.active = true;
                    }
                });
            }
        });
    }

    // Click Toggle menu
    toggletNavActive(item) {
        if (!item.active) {
            this.menuItems.forEach((a) => {
                if (this.menuItems.includes(item)) {
                    a.active = false;
                }
                if (!a.children) {
                    return false;
                }
                a.children.forEach((b) => {
                    if (a.children.includes(item)) {
                        b.active = false;
                    }
                });
            });
        }
        item.active = !item.active;
    }

    // For Horizontal Menu
    scrollToLeft() {
        if (this.margin >= -this.width) {
            this.margin = 0;
            this.leftArrowNone = true;
            this.rightArrowNone = false;
        } else {
            this.margin += this.width;
            this.rightArrowNone = false;
        }
    }

    scrollToRight() {
        if (this.margin <= -3051) {
            this.margin = -3464;
            this.leftArrowNone = false;
            this.rightArrowNone = true;
        } else {
            this.margin += -this.width;
            this.leftArrowNone = false;
        }
    }
}
