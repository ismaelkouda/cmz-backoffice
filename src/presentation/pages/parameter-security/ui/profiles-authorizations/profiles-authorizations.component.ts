import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import {
    PROFILES_AUTHORIZATIONS_STATE_ENUM,
    T_PROFILES_AUTHORIZATIONS_STATE_ENUM,
} from '../../data-access/profiles-authorizations/enums/profiles-authorizations-state.enum';
import { ProfilesAuthorizationsInterface } from '../../data-access/profiles-authorizations/interfaces/profiles-authorizations.interface';
import { ProfilesAuthorizationsApiService } from '../../data-access/profiles-authorizations/services/profiles-authorizations-api.service';
import { ProfilesAuthorizationsNavigationGuardService } from '../../data-access/profiles-authorizations/services/profiles-authorizations-navigation-guard.service';
import { PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM } from '../../data-access/profiles-authorizations/enums/profiles-authorizations-buttons-actions.enum';
import { ProfilesAuthorizationsPageActionsType } from '../../data-access/profiles-authorizations/types/profiles-authorizations-page-actions.type';
import { FORM } from '../../parameter-security-routing.module';

@Component({
    selector: `app-profiles-authorizations`,
    templateUrl: `./profiles-authorizations.component.html`,
    styleUrls: [`./profiles-authorizations.component.scss`],
})
export class ProfilesAuthorizationsComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public listProfilesAuthorizations$: Observable<
        Array<ProfilesAuthorizationsInterface>
    >;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listProfilesAuthorizationsState: Array<T_PROFILES_AUTHORIZATIONS_STATE_ENUM> =
        Object.values(PROFILES_AUTHORIZATIONS_STATE_ENUM);

    constructor(
        private activatedRoute: ActivatedRoute,
        private profilesAuthorizationsApiService: ProfilesAuthorizationsApiService,
        private router: Router,
        private navigationGuardService: ProfilesAuthorizationsNavigationGuardService
    ) {
        this.setupNavigationListener();
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.listProfilesAuthorizations$ =
            this.profilesAuthorizationsApiService.getProfilesAuthorizations();

        this.profilesAuthorizationsApiService.fetchProfilesAuthorizations();
        this.profilesAuthorizationsApiService
            .isLoadingProfilesAuthorizations()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }
    private setupNavigationListener(): void {
        this.navigationGuardService
            .getProfilesAuthorizationsNavigationGuard()
            .pipe(
                takeUntil(this.destroy$),
                filter(
                    (params) =>
                        params !== null &&
                        params.action !== undefined &&
                        params.action !== null
                ),
                filter(() => !this.navigationGuardService.isNavigating)
            )
            .subscribe((params) => {
                if (
                    params &&
                    Object.values(
                        PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM
                    ).includes(params.action)
                ) {
                    this.executeNavigation(params);
                }
            });
    }

    public executeNavigation(
        params: ProfilesAuthorizationsPageActionsType
    ): void {
        const id = params.data ? params.data : null;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.EDIT:
            case PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.ADD:
                routePath = `${FORM}/${id}`;
                break;
            default:
                console.warn('Action non gérée:', params.action);
                return;
        }
        console.log('Navigating to:', routePath);

        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public navigateByUrl(params: ProfilesAuthorizationsPageActionsType): void {
        this.navigationGuardService.setProfilesAuthorizationsNavigationGuard(
            {} as ProfilesAuthorizationsPageActionsType,
            true
        );
        this.navigationGuardService.setProfilesAuthorizationsNavigationGuard(
            params,
            true
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
