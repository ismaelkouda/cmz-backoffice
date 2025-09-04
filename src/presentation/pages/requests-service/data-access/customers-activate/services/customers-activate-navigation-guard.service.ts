import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
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
    constructor() {
        super(initialNavigationState);
    }

    setCustomersActivateNavigationGuard(
        customersActivateRoute: CustomersActivatePageActionsType,
        isInternal: boolean = false
    ): void {
        const newState: NavigationState = {
            routeData: customersActivateRoute,
            navigationInProgress: !isInternal,
            lastUpdated: Date.now(),
        };
        console.log("Mise à jour de l'etat:", newState);

        this.setState(newState, isInternal);
    }

    getCustomersActivateNavigationGuard(): Observable<CustomersActivatePageActionsType> {
        return this.select((state) => state.routeData).pipe(
            filter((routeData) => routeData !== null)
        ) as Observable<CustomersActivatePageActionsType>;
    }

    clearCustomersActivateNavigationGuard(): void {
        console.log("Mise à jour de l'etat:", this.state);
        this.setState({
            ...this.state,
            routeData: null,
            lastUpdated: Date.now(),
        });
    }

    get isNavigating(): boolean {
        return this.state.navigationInProgress;
    }
}
