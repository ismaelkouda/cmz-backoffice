import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../utils/custom-route-reuse-strategy';
import { EncodingDataService } from './encoding-data.service';

export interface Tab {
    id: string;
    title: string;
    path: string;
    icon?: string | null;
    active: boolean;
    closable: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class TabService {
    private readonly STORAGE_KEY = 'tabs';
    private _tabs = new BehaviorSubject<Tab[]>([]);
    public tabs$ = this._tabs.asObservable();

    constructor(
        private router: Router,
        private routeReuseStrategy: RouteReuseStrategy,
        private encodingService: EncodingDataService
    ) {
        const savedTabs = this.encodingService.getData(this.STORAGE_KEY) as
            | Tab[]
            | null;
        if (savedTabs && savedTabs.length > 0) {
            this._tabs.next(savedTabs);
        } else {
            this.addTab('Tableau de bord', '/dashboard', false);
        }
    }

    get tabs(): Tab[] {
        return this._tabs.getValue();
    }

    set tabs(tabs: Tab[]) {
        this._tabs.next(tabs);

        if (tabs.length === 0) {
            this.encodingService.removeData(this.STORAGE_KEY);
            this.encodingService.removeData(
                `${this.STORAGE_KEY}_children_component`
            );
        } else {
            this.encodingService.saveData(this.STORAGE_KEY, tabs, true);
        }
    }

    addTab(title: string, path: string, closable: boolean = true): void {
        const id = this.generateId(path);
        const tabs = this.tabs;
        console.log('tabs0', tabs);

        const existingTab = tabs.find((tab) => tab.id === id);
        console.log('existingTab', existingTab);

        if (existingTab) {
            this.activateTab(id);
        } else {
            tabs.forEach((tab) => (tab.active = false));

            tabs.push({
                id,
                title,
                path,
                active: true,
                closable,
            });

            this.tabs = [...tabs];
        }

        this.router.navigate([path]);
    }

    activateTab(id: string): void {
        const tabs = this.tabs.map((tab) => ({
            ...tab,
            active: tab.id === id,
        }));

        this.tabs = tabs;

        const activeTab = tabs.find((tab) => tab.id === id);
        if (activeTab) {
            this.router.navigate([activeTab.path]);
        }
    }

    closeTab(id: string): void {
        let tabs = this.tabs;

        const index = tabs.findIndex((tab) => tab.id === id);
        this.encodingService.removeData(tabs[index]?.path);
        this.encodingService.removeData(
            `${tabs[index]?.path}_children_component`
        );

        if (index === -1) return;
        if (!tabs[index].closable) return;

        const wasActive = tabs[index].active;
        const closedTabPath = tabs[index].path;

        tabs = tabs.filter((tab) => tab.id !== id);
        this.encodingService.saveData(this.STORAGE_KEY, tabs, true);
        if (wasActive && tabs.length > 0) {
            const newActiveIndex = Math.min(index, tabs.length - 1);
            tabs[newActiveIndex].active = true;
            this.router.navigate([tabs[newActiveIndex].path]);
        }

        this.tabs = tabs;

        if (this.routeReuseStrategy instanceof CustomRouteReuseStrategy) {
            this.routeReuseStrategy.clearHandle(closedTabPath);
        }
    }

    closeAllTabsExceptDashboard(): void {
        const dashboardTabId = this.generateId('/dashboard');

        const newTabs = this.tabs.filter((tab) => tab.id === dashboardTabId);
        this.tabs.map((tab) => {
            console.log('tab', tab);

            this.encodingService.removeData(tab.path);
            this.encodingService.removeData(`${tab.path}_children_component`);
        });
        // window.location.reload();

        if (newTabs.length > 0) {
            newTabs[0].active = true;
            this.tabs = newTabs;
            console.log('this.tabs', this.tabs);
            this.encodingService.removeData(this.STORAGE_KEY);
            this.encodingService.removeData(
                `${this.STORAGE_KEY}_children_component`
            );
            this.router.navigate(['/dashboard']);
            0;
            if (this.routeReuseStrategy instanceof CustomRouteReuseStrategy) {
                const pathsToClose = this.tabs
                    .filter((tab) => tab.id !== dashboardTabId)
                    .map((tab) => tab.path);

                pathsToClose.forEach((path) => {
                    (
                        this.routeReuseStrategy as CustomRouteReuseStrategy
                    ).clearHandle(path);
                });
            }
        }
    }

    private generateId(path: string): string {
        return path.replace(/[^a-zA-Z0-9]/g, '_');
    }
}
