import { MenuItem } from './../../interfaces/menu-item.interface';
import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { LOGO_ORANGE } from 'src/shared/constants/logoOrange.constant';
import { ORANGE } from '../../constants/logoOrange.constant';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
    public LOGO_ORANGE = LOGO_ORANGE;
    public ORANGE = ORANGE;
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

    constructor(
        private router: Router,
        public navServices: NavService,
        public layout: LayoutService,
        private encodingService: EncodingDataService
    ) {
        this.menuItems = this.encodingService.getData('menu') as
            | Array<MenuItem>
            | [];
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
                    });
                });
            }
        });
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
}
