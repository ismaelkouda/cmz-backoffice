import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LOGO_ANSUT } from '@shared/constants/logoAnsut.constant';
import {
    MenuItem,
    MenuItemChildren,
} from '@shared/interfaces/menu-item.interface';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { EncodingDataService } from '@shared/services/encoding-data.service';
import { LayoutService } from '@shared/services/layout.service';
import { NavService } from '@shared/services/nav.service';
import { TabService } from '@shared/services/tab.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
    public readonly config = inject(AppCustomizationService).config;
    public LOGO_ANSUT = LOGO_ANSUT;
    public menuItems: MenuItem[] = [];

    // For Horizontal Menu
    public margin = 0;
    public width = window.innerWidth;
    public leftArrowNone = true;
    public rightArrowNone = false;

    private sub!: Subscription;

    constructor(
        private readonly router: Router,
        public navServices: NavService,
        public layout: LayoutService,
        private readonly encodingService: EncodingDataService,
        private readonly tabService: TabService
    ) {}

    ngOnInit(): void {
        this.menuItems =
            (this.encodingService.getData('menu') as MenuItem[]) || [];

        this.sub = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                for (const item of this.menuItems) {
                    if (item.path === event.url) {
                        this.setNavActive(item);
                    }

                    if (item.children) {
                        for (const subItem of item.children) {
                            if (subItem.path === event.url) {
                                this.setNavActive(subItem);
                            }
                        }
                    }
                }
            }
        });
    }

    // Active Nave state
    setNavActive(itemSelected: MenuItem | MenuItemChildren): void {
        for (const menuItem of this.menuItems) {
            if (menuItem !== itemSelected) {
                menuItem.active = false;
            }
            if (
                (menuItem.children &&
                    menuItem.children.some(
                        (item) => item.code === itemSelected.code
                    )) ||
                (menuItem.path && menuItem.path === itemSelected.path)
            ) {
                menuItem.active = true;
                //this.addTab(menuItem);
            }
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.width = (event.target as Window).innerWidth - 500;
    }

    sidebarToggle(): void {
        this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    }

    toggletNavActive(item: MenuItem): void {
        if (!item.active) {
            for (const menuItem of this.menuItems) {
                menuItem.active = false;
            }
        }
        item.active = !item.active;
    }

    scrollToLeft(): void {
        if (this.margin >= -this.width) {
            this.margin = 0;
            this.leftArrowNone = true;
            this.rightArrowNone = false;
        } else {
            this.margin += this.width;
            this.rightArrowNone = false;
        }
    }

    scrollToRight(): void {
        if (this.margin <= -3051) {
            this.margin = -3464;
            this.leftArrowNone = false;
            this.rightArrowNone = true;
        } else {
            this.margin += -this.width;
            this.leftArrowNone = false;
        }
    }

    /*     addTab(item: MenuItem | MenuItemChildren): void {
        if (item.path && item.title) {
            setTimeout(() => {
                const isTablauDeBord = item.path === '/dashboard';
                this.tabService.addTab(
                    item.title || '',
                    item.path || '',
                    !isTablauDeBord
                );
            }, 0);
        }
    } */

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
