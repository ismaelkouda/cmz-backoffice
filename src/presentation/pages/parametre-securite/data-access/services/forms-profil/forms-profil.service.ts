import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
// import { formsProfilApiResponseInterface } from '../interfaces/forms-profil.interface';
import { formsProfilEndpointEnum } from '../../enums/forms-profil/forms-profil-endpoint.enum';

@Injectable()
export class FormsProfilApiService {
    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste Permissions*************** */
    private permissionsSubject = new BehaviorSubject<Array<any>>([]);
    private loadingPermissionsSubject = new BehaviorSubject<boolean>(false);
    private apiResponsePermissionsSubject = new BehaviorSubject<any>({} as any);
    fetchPermissions(profilId: string): void {
        if (this.loadingPermissionsSubject.getValue()) return;
        this.loadingPermissionsSubject.next(true);
        const url: string = formsProfilEndpointEnum.USER_PROFILES_ID.replace(
            '{/id}',
            profilId
        );

        this.http
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const permissions = response?.['data']?.permissions.map(
                        (permission) => {
                            console.log('permission', permission);
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
                    this.permissionsSubject.next(permissions);
                    this.apiResponsePermissionsSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching permissions', error);
                    return of([]);
                }),
                finalize(() => this.loadingPermissionsSubject.next(false))
            )
            .subscribe();
    }

    getPermissions(): Observable<Array<any>> {
        return this.permissionsSubject.asObservable();
    }
    isLoadingPermissions(): Observable<boolean> {
        return this.loadingPermissionsSubject.asObservable();
    }
    getApiResponsePermissions(): Observable<any> {
        return this.apiResponsePermissionsSubject.asObservable();
    }

    private habilitationSubject = new BehaviorSubject<Array<any>>([]);
    private loadingHabilitationSubject = new BehaviorSubject<boolean>(false);
    private apiResponseHabilitationSubject = new BehaviorSubject<any>(
        {} as any
    );
    fetchHabilitation(profilId: string): void {
        if (this.loadingHabilitationSubject.getValue()) return;
        this.loadingHabilitationSubject.next(true);
        const url: string = formsProfilEndpointEnum.USER_PROFILES_ID.replace(
            '{/id}',
            profilId
        );

        this.http
            .post<Object>(this.BASE_URL + url, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const habilitation = response?.['data']?.habilitations.map(
                        (habilitation) => {
                            console.log('habilitation', habilitation);
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
                    this.habilitationSubject.next(habilitation);
                    this.apiResponseHabilitationSubject.next(response);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching habilitation', error);
                    return of([]);
                }),
                finalize(() => this.loadingHabilitationSubject.next(false))
            )
            .subscribe();
    }

    getHabilitation(): Observable<Array<any>> {
        return this.habilitationSubject.asObservable();
    }
    isLoadingHabilitation(): Observable<boolean> {
        return this.loadingHabilitationSubject.asObservable();
    }
    getApiResponseHabilitation(): Observable<any> {
        return this.apiResponseHabilitationSubject.asObservable();
    }
}
