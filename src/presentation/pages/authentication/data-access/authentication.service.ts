import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    finalize,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import { LoginCredential } from '../domain/entities/login.credential';
import { EnvService } from './../../../../shared/services/env.service';
import { EndPointUrl } from './api.enum';
import { LoginResponseInterface } from './interfaces/login-response.interface';
import { VariablesResponseInterface } from './interfaces/variables-response.interface';

@Injectable()
export class AuthenticationService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private envService: EnvService,
        private toastService: ToastrService
    ) {
        this.baseUrl = this.envService.authenticationUrl;
    }

    private loginSubject = new BehaviorSubject<LoginResponseInterface>(
        {} as LoginResponseInterface
    );
    private loadingLoginSubject = new BehaviorSubject<boolean>(false);

    fetchLogin(
        credentials: LoginCredential,
        onAuthError: (error: any) => void
    ): Observable<LoginResponseInterface> {
        if (this.loadingLoginSubject.getValue())
            return of({} as LoginResponseInterface);
        this.loadingLoginSubject.next(true);

        const url = `${this.baseUrl}${EndPointUrl.AUTHENTICATION}`;
        return this.http.post<LoginResponseInterface>(url, credentials).pipe(
            debounceTime(1000),
            switchMap((response) => {
                if (response.error === false) {
                    this.loginSubject.next(response);
                    const user = response.data.user;
                    this.toastService.success(`Bienvenue ${user.last_name} ${user.first_name}`);
                } else {
                    this.toastService.error(response.message);
                }
                return of(response);
            }),
            catchError((error) => {
                console.error('Error fetching login', error);
                onAuthError(error);
                return of({} as LoginResponseInterface);
            }),
            finalize(() => this.loadingLoginSubject.next(false))
        );
    }

    getLogin(): Observable<LoginResponseInterface> {
        return this.loginSubject.asObservable();
    }

    isLoadingLogin(): Observable<boolean> {
        return this.loadingLoginSubject.asObservable();
    }

    private variablesSubject = new BehaviorSubject<VariablesResponseInterface>(
        {} as VariablesResponseInterface
    );
    private loadingVariablesSubject = new BehaviorSubject<boolean>(false);

    fetchVariables(): Observable<VariablesResponseInterface> {
        if (this.loadingVariablesSubject.getValue())
            return of({} as VariablesResponseInterface);
        this.loadingVariablesSubject.next(true);

        const variablesUrl = `${this.baseUrl}${EndPointUrl.LIEN_GRAPHANA_VARIABLES}`;

        return this.http
            .post<VariablesResponseInterface>(variablesUrl, {})
            .pipe(
                debounceTime(1000),
                switchMap((variablesResponse) => {
                    if (variablesResponse?.error === false) {
                        this.variablesSubject.next(variablesResponse);
                    } else {
                        this.toastService.error(variablesResponse.message);
                    }
                    return of(variablesResponse);
                }),
                catchError((error) => {
                    console.error('Error fetching variables', error);
                    return of({} as VariablesResponseInterface);
                }),
                finalize(() => this.loadingVariablesSubject.next(false))
            );
    }

    getVariables(): Observable<VariablesResponseInterface> {
        return this.variablesSubject.asObservable();
    }

    isLoadingVariables(): Observable<boolean> {
        return this.loadingVariablesSubject.asObservable();
    }
}
