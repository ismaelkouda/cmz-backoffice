import { EnvService } from './../../../../shared/services/env.service';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    finalize,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';

@Injectable()
export class AuthenticationService {
    public baseUrl: string;

    constructor(private http: HttpClient, private envService: EnvService) {
        this.baseUrl = this.envService.apiUrl;
    }

    OnLogin(data): Observable<any> {
        const url: string = <string>EndPointUrl.AUTHENTICATION;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }

    private loginSubject = new BehaviorSubject<any[]>([]);
    private loadingLoginSubject = new BehaviorSubject<boolean>(false);

    fetchLogin(): void {
        if (this.loadingLoginSubject.getValue()) return; // Évite les doublons

        const url: string = EndPointUrl.AUTHENTICATION;
        this.loadingLoginSubject.next(true);

        this.http
            .post<Object>(`${this.baseUrl}${url}`, {})
            .pipe(
                debounceTime(1000),
                switchMap((response: any) => {
                    this.loginSubject.next(response?.['data']);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching login', error);
                    return of([]);
                }),
                finalize(() => this.loadingLoginSubject.next(false))
            )
            .subscribe();
    }

    getLogin(): Observable<any[]> {
        return this.loginSubject.asObservable();
    }

    isLoadingLogin(): Observable<boolean> {
        return this.loadingLoginSubject.asObservable();
    }

    getVariables(data): Observable<any> {
        const url: string = <string>EndPointUrl.LIEN_GRAPHANA_VARIABLES;
        return this.http.post(`${this.baseUrl}${url}`, data);
    }
}
