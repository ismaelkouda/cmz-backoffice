import { CommonModule } from '@angular/common';
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LOGO_ANSUT } from '../../../shared/constants/logoAnsut.constant';
import { EncodingDataService } from '../../services/encoding-data.service';
import { LayoutService } from '../../services/layout.service';
import { NavService } from '../../services/nav.service';
import { TabService } from '../../services/tab.service';
import {
    MenuItem,
    MenuItemChildren,
} from './../../interfaces/menu-item.interface';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit, OnDestroy {
    public LOGO_ANSUT = LOGO_ANSUT;
    public iconSidebar!: string;
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
    this.menuItems = this.encodingService.getData('menu') as Array<MenuItem> | [];
    this.sub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
            this.menuItems.filter((items: MenuItem) => {
                let shouldKeep = false;
                
                if (items.path === event.url) {
                    this.setNavActive(items);
                    shouldKeep = true;
                }
                
                if (items.children) {
                    items.children.filter((subItems: MenuItemChildren) => {
                        if (subItems.path === event.url) {
                            this.setNavActive(subItems);
                            return true; // Keep this subItem
                        }
                        return false; // Don't keep this subItem
                    });
                }
                
                return shouldKeep;
            });
        }
    });
}

    // Active Nave state
    setNavActive(itemSelected: MenuItem | MenuItemChildren) {
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
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.width = (event.target as Window).innerWidth - 500;
    }

    sidebarToggle() {
        this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    }

    // Click Toggle menu
    toggletNavActive(item: any) {
        if (!item.active) {
            for (const a of this.menuItems) {
                if (this.menuItems.includes(item)) {
                    a.active = false;
                }
                if (!a.children) {
                    continue;
                }
            }
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
    addTab(item: MenuItem | MenuItemChildren): void {
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
