import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, catchError, debounceTime, finalize, Observable, of, tap } from "rxjs";
import { LoginCredential } from "../../domain/entities/login.credential";
import { LoginDataSource } from "../datasources/login.datasource";
import { LoginResponseInterface } from "../interfaces/login-response.interface";
import { LoginRepository } from "./login-repository";

Injectable()

export class LoginRepositoryImpl implements LoginRepository {

    private loginDataSource = inject(LoginDataSource)
    private toastService = inject(ToastrService)

    private loginSubject = new BehaviorSubject<LoginResponseInterface>({} as LoginResponseInterface);
    private loadingLoginSubject = new BehaviorSubject<boolean>(false);

    fetchLogin(credentials: LoginCredential): Observable<LoginResponseInterface> {
        if (this.loadingLoginSubject.getValue())
            return of({} as LoginResponseInterface);
        this.loadingLoginSubject.next(true);

        return this.loginDataSource.fetchLogin(credentials).pipe(
            debounceTime(1000),
            tap(response => {this.handleLoginResponse(response)}),
            catchError(error => this.handleLoginError(error)),
            finalize(() => this.loadingLoginSubject.next(false))
        );
    }

    getCurrentLogin(): Observable<LoginResponseInterface> {
        return this.loginSubject.asObservable();
    }

    getLoginLoading(): Observable<boolean> {
        return this.loadingLoginSubject.asObservable();
    }
    
    private handleLoginResponse(response: LoginResponseInterface): void {
        if (response.error === false) {
            this.loginSubject.next(response);
            const user = response.data.user;
            this.toastService.success(`Bienvenue ${user.last_name} ${user.first_name}`);
        } else {
            this.toastService.error(response.message);
        }
    }

    private handleLoginError(error: any): Observable<LoginResponseInterface> {
        console.error('Error during login:', error);
        this.toastService.error('Erreur lors de la connexion');
        return of({} as LoginResponseInterface);
    }

}