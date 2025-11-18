import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ManagedCustomersPageActionsType } from '../../managed-customers/types/managed-customers-page-actions.type';
import { CommercialEnterprisesNavigationStoreService } from './commercial-enterprises-navigation-store.service';

interface NavigationState {
    routeData: ManagedCustomersPageActionsType | null;
    navigationInProgress: boolean;
    lastUpdated: number;
}

const initialNavigationState: NavigationState = {
    routeData: null,
    navigationInProgress: false,
    lastUpdated: Date.now(),
};

@Injectable()
export class CommercialEnterprisesNavigationGuardService extends CommercialEnterprisesNavigationStoreService<NavigationState> {
    constructor() {
        super(initialNavigationState);
    }

    setCommercialEnterprisesNavigationGuard(
        customersActivateRoute: ManagedCustomersPageActionsType,
        isInternal = false
    ): void {
        const newState: NavigationState = {
            routeData: customersActivateRoute,
            navigationInProgress: !isInternal,
            lastUpdated: Date.now(),
        };

        this.setState(newState, isInternal);
    }

    getCommercialEnterprisesNavigationGuard(): Observable<ManagedCustomersPageActionsType> {
        return this.select((state) => state.routeData).pipe(
            filter((routeData) => routeData !== null)
        ) as Observable<ManagedCustomersPageActionsType>;
    }

    clearCommercialEnterprisesNavigationGuard(): void {
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
