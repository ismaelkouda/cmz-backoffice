import {
    MenuItem,
    MenuItemChildren,
} from './../../interfaces/menu-item.interface';
import {
    Component,
    ViewEncapsulation,
    HostListener,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { LOGO_ANSUT } from 'src/shared/constants/logoAnsut.constant';
import { TabService } from '../../services/tab.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit, OnDestroy {
    public LOGO_ANSUT = LOGO_ANSUT;
    public iconSidebar;
    public menuItems: Array<MenuItem> = [];
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

    private sub!: Subscription;

    constructor(
        private router: Router,
        public navServices: NavService,
        public layout: LayoutService,
        private encodingService: EncodingDataService,
        private tabService: TabService
    ) {}

    ngOnInit(): void {
        this.menuItems = this.encodingService.getData('menu') as
            | Array<MenuItem>
            | [];
        this.sub = this.router.events.subscribe((event) => {
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
                    });
                    // items.children.filter((subItems) => {
                    //     const basePath = event.url.split('?')[0];
                    //     const trimmedPath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
                    //     const menuPath = subItems.path.endsWith('/') ? subItems.path.slice(0, -1) : subItems.path;
                    //     if (menuPath === trimmedPath || trimmedPath.startsWith(menuPath + '/')) {
                    //         this.setNavActive(subItems);
                    //     }
                    // });
                });
            }
        });
    }

    // Active Nave state
    setNavActive(itemSelected) {
        this.menuItems.filter((menuItem) => {
            if (menuItem !== itemSelected) {
                menuItem.active = false;
            }
            if (
                (menuItem.children &&
                    menuItem.children.some(
                        (item) => item.data === itemSelected.data
                    )) ||
                (menuItem.path && menuItem.path === itemSelected.path)
            ) {
                console.log('menuItem', menuItem);
                console.log('item', itemSelected);
                menuItem.active = true;
                this.addTab(itemSelected);
            }
            // menuItem.children?.filter((subItem) => {
            //     if (subItem.children && subItem.children.includes(item)) {
            //         subItem.active = true;
            //         this.addTab(item);
            //     }
            // })
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.width = event.target.innerWidth - 500;
    }

    sidebarToggle() {
        this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
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

    // Méthode pour ajouter un onglet
    addTab(item: MenuItemChildren): void {
        if (item.path && item.title) {
            // Utiliser un timeout de 0ms pour s'assurer que cet appel se produit
            // après que tout le traitement actuel soit terminé
            setTimeout(() => {
                const isTablauDeBord = item.path === '/dashboard';
                this.tabService.addTab(
                    item.title || '',
                    item.path || '',
                    !isTablauDeBord // Le tableau de bord n'est pas fermable
                );
            }, 0);
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
