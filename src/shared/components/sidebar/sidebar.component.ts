import { AsyncPipe, CommonModule } from '@angular/common';
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [CommonModule, AsyncPipe, RouterLink, TranslateModule],
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

        console.log('🔍 Debug menu loading:');
  
  // Vérifier ce qui est stocké
  const storedMenu = this.encodingService.getData('menu')as Array<MenuItem> | [];
  console.log('Stored menu:', storedMenu);
  console.log('Type:', typeof storedMenu);
  console.log('Is array:', Array.isArray(storedMenu));
  console.log('Length:', storedMenu?.length);
  
  // Vérifier le localStorage directement
  try {
    const raw = localStorage.getItem('menu');
    console.log('Raw localStorage:', raw);
  } catch (e) {
    console.error('Cannot access localStorage:', e);
  }
  
  this.menuItems = storedMenu || [];
  
    this.menuItems = this.encodingService.getData('menu') as Array<MenuItem> | [];
    console.log("this.menuItems", this.menuItems)
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
                        (item) => item.code === itemSelected.code
                    )) ||
                (menuItem.path && menuItem.path === itemSelected.path)
            ) {
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

    addTab(item: MenuItem | MenuItemChildren): void {
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
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
