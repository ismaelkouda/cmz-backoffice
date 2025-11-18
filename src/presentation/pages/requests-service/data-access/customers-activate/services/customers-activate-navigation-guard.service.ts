import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from '../../../../../../shared/interfaces/menu-item.interface';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';
import { CustomersActivatePageActionsType } from '../types/customers-activate-page-actions.type';
import { CustomersActivateNavigationStoreService } from './customers-activate-navigation-store.service';

interface NavigationState {
    routeData: CustomersActivatePageActionsType | null;
    navigationInProgress: boolean;
    lastUpdated: number;
}

const initialNavigationState: NavigationState = {
    routeData: null,
    navigationInProgress: false,
    lastUpdated: Date.now(),
};

@Injectable()
export class CustomersActivateNavigationGuardService extends CustomersActivateNavigationStoreService<NavigationState> {
    private STORAGE_KEY!: string;
    private destroy$ = new Subject<void>();
    constructor(
        private encodingService: EncodingDataService,
        private activatedRoute: ActivatedRoute
    ) {
        super(initialNavigationState);
        const menuItems = this.encodingService.getData('menu') as
            | Array<MenuItem>
            | [];
        this.activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe(() => {
            const url = this.activatedRoute.snapshot.url
                .map((segment) => segment.path)
                .join('/');
            for (const parent of menuItems) {
                if (parent.children) {
                    const child = parent.children.find((c) =>
                        url.startsWith(c.path)
                    );
                    if (child) {
                        this.STORAGE_KEY = child.path;
                        return;
                    }
                }
            }
        });
        const savedState = this.encodingService.getData<NavigationState>(
            this.STORAGE_KEY
        );

        if (savedState) {
            this.setState(savedState, true);
        }
    }

    setCustomersActivateNavigationGuard(
        customersActivateRoute: CustomersActivatePageActionsType,
        isInternal: boolean = false
    ): void {
        const newState: NavigationState = {
            ...this.state,
            routeData: customersActivateRoute,
            navigationInProgress: !isInternal,
            lastUpdated: Date.now(),
        };

        // this.setState(newState, isInternal);
        this.encodingService.saveData(this.STORAGE_KEY, newState);
    }

    // getCustomersActivateNavigationGuard(): Observable<CustomersActivatePageActionsType | null> {
    //     const savedState = this.encodingService.getData<NavigationState>(this.STORAGE_KEY);
    //     if (savedState) {
    //         this.setState(savedState, true);
    //     } else {
    //         this.setState(initialNavigationState, true);
    //     }
    //     return this.select((state) => state.routeData).pipe(
    //         filter((routeData) => routeData !== null)
    //     ) as Observable<CustomersActivatePageActionsType>;
    // }

    clearCustomersActivateNavigationGuard(): void {
        const clearedState: NavigationState = {
            ...this.state,
            routeData: null,
            navigationInProgress: false,
            lastUpdated: Date.now(),
        };

        this.setState(clearedState, true);
        this.encodingService.removeData(this.STORAGE_KEY);
    }

    get isNavigating(): boolean {
        return this.state.navigationInProgress;
    }
}
