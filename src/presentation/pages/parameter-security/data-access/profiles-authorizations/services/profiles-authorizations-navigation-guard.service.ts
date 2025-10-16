import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ProfilesAuthorizationsPageActionsType } from '../types/profiles-authorizations-page-actions.type';
import { ProfilesAuthorizationsNavigationStoreService } from './profiles-authorizations-navigation-store.service';

interface NavigationState {
    routeData: ProfilesAuthorizationsPageActionsType | null;
    navigationInProgress: boolean;
    lastUpdated: number;
}

const initialNavigationState: NavigationState = {
    routeData: null,
    navigationInProgress: false,
    lastUpdated: Date.now(),
};

@Injectable()
export class ProfilesAuthorizationsNavigationGuardService extends ProfilesAuthorizationsNavigationStoreService<NavigationState> {
    constructor() {
        super(initialNavigationState);
    }

    setProfilesAuthorizationsNavigationGuard(
        customersActivateRoute: ProfilesAuthorizationsPageActionsType,
        isInternal: boolean = false
    ): void {
        const newState: NavigationState = {
            routeData: customersActivateRoute,
            navigationInProgress: !isInternal,
            lastUpdated: Date.now(),
        };

        this.setState(newState, isInternal);
    }

    getProfilesAuthorizationsNavigationGuard(): Observable<ProfilesAuthorizationsPageActionsType> {
        return this.select((state) => state.routeData).pipe(
            filter((routeData) => routeData !== null)
        ) as Observable<ProfilesAuthorizationsPageActionsType>;
    }

    clearProfilesAuthorizationsNavigationGuard(): void {
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
