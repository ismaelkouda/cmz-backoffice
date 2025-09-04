import { Observable, BehaviorSubject, of } from 'rxjs';
import {
    catchError,
    finalize,
    debounceTime,
    switchMap,
    take,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { ProfilesAuthorizationsEndpointEnum } from '../enums/profiles-authorizations-endpoint.enum';
import {
    ProfilesAuthorizationsApiResponseInterface,
    ProfilesAuthorizationsInterface,
} from '../interfaces/profiles-authorizations.interface';
import { ProfilesAuthorizationsDetailsInterface } from '../interfaces/profiles-authorizations-details.interface';
import { ToastrService } from 'ngx-toastr';
import { ProfilesAuthorizationsPermissionsInterface } from '../interfaces/profiles-authorizations-permissions.interface';
import { ProfilesAuthorizationsHabilitationInterface } from '../interfaces/profiles-authorizations-habilitation.interface';

@Injectable()
export class ProfilesAuthorizationsApiService {
    private BASE_URL: string;

    constructor(
        private httpClient: HttpClient,
        private envService: EnvService
    ) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste profiles authorizations*************** */

    private profilesAuthorizationsSubject = new BehaviorSubject<
        Array<ProfilesAuthorizationsInterface>
    >([]);
    private loadingProfilesAuthorizationsSubject = new BehaviorSubject<boolean>(
        false
    );
    private apiResponseProfilesAuthorizationsSubject =
        new BehaviorSubject<ProfilesAuthorizationsApiResponseInterface>(
            {} as ProfilesAuthorizationsApiResponseInterface
        );
    fetchProfilesAuthorizations(): void {
        if (this.loadingProfilesAuthorizationsSubject.getValue()) return;
        this.loadingProfilesAuthorizationsSubject.next(true);
        const url: string =
            ProfilesAuthorizationsEndpointEnum.POST_USER_PROFILES_ALL;

        this.httpClient
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const profilesAuthorizations = response?.['data']?.data;
                    this.profilesAuthorizationsSubject.next(
                        profilesAuthorizations
                    );
                    this.apiResponseProfilesAuthorizationsSubject.next(
                        response
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching profilesAuthorizations',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingProfilesAuthorizationsSubject.next(false)
                )
            )
            .subscribe();
    }

    getProfilesAuthorizations(): Observable<
        Array<ProfilesAuthorizationsInterface>
    > {
        return this.profilesAuthorizationsSubject.asObservable();
    }
    isLoadingProfilesAuthorizations(): Observable<boolean> {
        return this.loadingProfilesAuthorizationsSubject.asObservable();
    }
    getApiResponseProfilesAuthorizations(): Observable<ProfilesAuthorizationsApiResponseInterface> {
        return this.apiResponseProfilesAuthorizationsSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des profiles authorizations*************** */

    private profilesAuthorizationsDetailsSubject =
        new BehaviorSubject<ProfilesAuthorizationsDetailsInterface>(
            {} as ProfilesAuthorizationsDetailsInterface
        );
    private loadingProfilesAuthorizationsDetailsSubject =
        new BehaviorSubject<boolean>(false);

    fetchProfilesAuthorizationsDetails(id: string): void {
        if (this.loadingProfilesAuthorizationsDetailsSubject.getValue()) return;

        const url: string =
            ProfilesAuthorizationsEndpointEnum.POST_USER_PROFILES_DETAILS.replace(
                '{id}',
                id
            );
        this.loadingProfilesAuthorizationsDetailsSubject.next(true);

        this.httpClient
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.profilesAuthorizationsDetailsSubject.next(
                        response?.['data']
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching profilesAuthorizationsDetails',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingProfilesAuthorizationsDetailsSubject.next(false)
                )
            )
            .subscribe();
    }

    getProfilesAuthorizationsDetails(): Observable<ProfilesAuthorizationsDetailsInterface> {
        return this.profilesAuthorizationsDetailsSubject.asObservable();
    }

    isLoadingProfilesAuthorizationsDetails(): Observable<boolean> {
        return this.loadingProfilesAuthorizationsDetailsSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des profiles authorizations PERMISSION*************** */

    private profilesAuthorizationsPermissionsSubject =
        new BehaviorSubject<ProfilesAuthorizationsPermissionsInterface>(
            {} as ProfilesAuthorizationsPermissionsInterface
        );
    private loadingProfilesAuthorizationsPermissionsSubject =
        new BehaviorSubject<boolean>(false);

    fetchProfilesAuthorizationsPermissions(): void {
        if (this.loadingProfilesAuthorizationsPermissionsSubject.getValue())
            return;

        const url: string =
            ProfilesAuthorizationsEndpointEnum.POST_USER_PROFILES_DETAILS;
        this.loadingProfilesAuthorizationsPermissionsSubject.next(true);

        this.httpClient
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const permissions = response?.['data']?.permissions.map(
                        (permission) => {
                            return {
                                ...permission['data'],
                                label: permission['data']?.title,
                                children: permission?.['children']?.map(
                                    (child) => {
                                        return {
                                            ...child['data'],
                                            label: child['data']?.title,
                                        };
                                    }
                                ),
                            };
                        }
                    );
                    this.profilesAuthorizationsPermissionsSubject.next(
                        permissions
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching profilesAuthorizationsPermissions',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingProfilesAuthorizationsPermissionsSubject.next(
                        false
                    )
                )
            )
            .subscribe();
    }

    getProfilesAuthorizationsPermissions(): Observable<ProfilesAuthorizationsPermissionsInterface> {
        return this.profilesAuthorizationsPermissionsSubject.asObservable();
    }

    isLoadingProfilesAuthorizationsPermissions(): Observable<boolean> {
        return this.loadingProfilesAuthorizationsPermissionsSubject.asObservable();
    }

    /*********************Méthode pour récupérer la liste des profiles authorizations HABILITATION*************** */

    private profilesAuthorizationsHabilitationSubject =
        new BehaviorSubject<ProfilesAuthorizationsHabilitationInterface>(
            {} as ProfilesAuthorizationsHabilitationInterface
        );
    private loadingProfilesAuthorizationsHabilitationSubject =
        new BehaviorSubject<boolean>(false);

    fetchProfilesAuthorizationsHabilitation(): void {
        if (this.loadingProfilesAuthorizationsHabilitationSubject.getValue())
            return;

        const url: string =
            ProfilesAuthorizationsEndpointEnum.POST_USER_PROFILES_DETAILS;
        this.loadingProfilesAuthorizationsHabilitationSubject.next(true);

        this.httpClient
            .post<Object>(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    const habilitation = response?.['data']?.habilitations.map(
                        (habilitation) => {
                            return {
                                ...habilitation['data'],
                                label: habilitation['data']?.title,
                                children: habilitation?.['children']?.map(
                                    (child) => {
                                        return {
                                            parent_value:
                                                habilitation['data'].value,
                                            ...child['data'],
                                            label: child['data']?.title,
                                        };
                                    }
                                ),
                            };
                        }
                    );
                    this.profilesAuthorizationsHabilitationSubject.next(
                        habilitation
                    );
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching profilesAuthorizationsHabilitation',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingProfilesAuthorizationsHabilitationSubject.next(
                        false
                    )
                )
            )
            .subscribe();
    }

    getProfilesAuthorizationsHabilitation(): Observable<ProfilesAuthorizationsHabilitationInterface> {
        return this.profilesAuthorizationsHabilitationSubject.asObservable();
    }

    isLoadingProfilesAuthorizationsHabilitation(): Observable<boolean> {
        return this.loadingProfilesAuthorizationsHabilitationSubject.asObservable();
    }

    /*********************Méthode pour valider pour cree un profiles authorizations *************** */

    private createProfilesAuthorizationsServiceSubject =
        new BehaviorSubject<any>({} as any);
    private loadingCreateProfilesAuthorizationsServiceSubject =
        new BehaviorSubject<boolean>(false);

    fetchCreateProfilesAuthorizationsService(
        data: any,
        toastService: ToastrService,
        goOut?: () => void
    ): void {
        if (this.loadingCreateProfilesAuthorizationsServiceSubject.getValue())
            return;
        this.loadingCreateProfilesAuthorizationsServiceSubject.next(true);
        const url: string =
            ProfilesAuthorizationsEndpointEnum.POST_USER_PROFILES_STORE;
        this.httpClient
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                take(1),
                debounceTime(1000),
                switchMap((response: any) => {
                    const createProfilesAuthorizationsService = response;
                    this.createProfilesAuthorizationsServiceSubject.next(
                        createProfilesAuthorizationsService
                    );
                    this.handleSuccessFullFetch(response, toastService, goOut);
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching createProfilesAuthorizations',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingCreateProfilesAuthorizationsServiceSubject.next(
                        false
                    )
                )
            )
            .subscribe();
    }

    getCreateProfilesAuthorizationsService(): Observable<any> {
        return this.createProfilesAuthorizationsServiceSubject.asObservable();
    }
    isLoadingCreateProfilesAuthorizationsService(): Observable<boolean> {
        return this.loadingCreateProfilesAuthorizationsServiceSubject.asObservable();
    }

    handleSuccessFullFetch(
        response: any,
        toastService: ToastrService,
        goOut?: () => void
    ) {
        if (response && response.error === false && toastService) {
            toastService.success(response.message);
            if (goOut) {
                goOut();
            }
            this.fetchProfilesAuthorizations();
        } else if (response && response.error === true) {
            toastService.error(response.message);
        }
    }
}
