import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { InvoicePageActionsType } from '../types/invoice-page-actions.type';
import { InvoiceNavigationStoreService } from './invoice-navigation-store.service';

interface NavigationState {
    routeData: InvoicePageActionsType | null;
    navigationInProgress: boolean;
    lastUpdated: number;
}

const initialNavigationState: NavigationState = {
    routeData: null,
    navigationInProgress: false,
    lastUpdated: Date.now(),
};

@Injectable()
export class InvoiceNavigationGuardService extends InvoiceNavigationStoreService<NavigationState> {
    constructor() {
        super(initialNavigationState);
    }

    setInvoiceNavigationGuard(
        customersActivateRoute: InvoicePageActionsType,
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

    getInvoiceNavigationGuard(): Observable<InvoicePageActionsType> {
        return this.select((state) => state.routeData).pipe(
            filter((routeData) => routeData !== null)
        ) as Observable<InvoicePageActionsType>;
    }

    clearInvoiceNavigationGuard(): void {
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
