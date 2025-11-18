import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

// Menu
export interface Menu {
    headTitle1?: string;
    headTitle2?: string;
    path?: string;
    title?: string;
    icon?: string;
    type?: string;
    badgeType?: string;
    badgeValue?: string;
    active?: boolean;
    bookmark?: boolean;
    children?: Menu[];
    statut?: boolean;
    data?: string;
}

@Injectable({
    providedIn: 'root',
})
export class NavService implements OnDestroy {
    public listMenuItems!: any[];
    public user: any;

    private unsubscriber = new Subject<any>();
    public screenWidth = new BehaviorSubject<number>(window.innerWidth);
    // MENU_SIDEBAR: any = menuJson;

    // Search Box
    public search = false;

    // Language
    public language = false;

    // Menu
    public listMenu: any = [];

    // Mega Menu
    public megaMenu = false;
    public levelMenu = false;
    public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

    // Collapse Sidebar
    public collapseSidebar: boolean = window.innerWidth < 1100 ? true : false;

    // For Horizontal Layout Mobile
    public horizontal: boolean = window.innerWidth < 1100 ? false : true;

    // Full screen
    public fullScreen = false;

    constructor(private router: Router) {
        this.setScreenWidth(window.innerWidth);
        fromEvent(window, 'resize')
            .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
            .subscribe((evt: any) => {
                this.setScreenWidth(evt.target.innerWidth);
                if (evt.target.innerWidth < 1100) {
                    this.collapseSidebar = true;
                    this.megaMenu = false;
                    this.levelMenu = false;
                }
                if (evt.target.innerWidth < 1100) {
                    this.megaMenuColapse = true;
                }
            });
        if (window.innerWidth < 1100) {
            // Detect Route change sidebar close
            this.router.events.subscribe((event) => {
                this.collapseSidebar = true;
                this.megaMenu = false;
                this.levelMenu = false;
            });
        }
    }

    ngOnDestroy() {
        // this.unsubscriber.next();
        this.unsubscriber.complete();
    }

    private setScreenWidth(width: number): void {
        this.screenWidth.next(width);
    }

    // Array
    // items = new BehaviorSubject<Menu[]>(this.MENU_SIDEBAR);
}
