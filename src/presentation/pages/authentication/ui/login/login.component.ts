import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { DASHBOARD } from '../../../../../shared/routes/routes';
import { REINITIALISATION } from '../../../../app-routing.module';
import { FORGOT_PASSWORD } from '../../../password-reset/password-reset-routing.module';

import { AuthenticationService } from '../../data-access/authentication.service';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { AsFeatureService } from '../../../../../shared/services/as-feature.service';
import { StoreCurrentUserService } from '../../../../../shared/services/store-current-user.service';

import { LOGO_ORANGE } from '../../../../../shared/constants/logoOrange.constant';
import { menuJson } from './../../../../../assets/menu';
import {
    AuthToken,
    CurrentUser,
    LoginResponse,
} from '../../../../../shared/interfaces/current-user.interface';

interface LoginCredentials {
    username: string;
    password: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    readonly REINITIALISATION = REINITIALISATION;
    readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    readonly LOGO_ORANGE = LOGO_ORANGE;

    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
        ]),
    });

    private destroy$ = new Subject<void>();
    loading$ = new BehaviorSubject<boolean>(false);
    permissionsJson = menuJson;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private toastr: ToastrService,
        private encodingService: EncodingDataService,
        private currentUserService: StoreCurrentUserService,
        private featureService: AsFeatureService
    ) {}

    ngOnInit(): void {
        this.setupFormValidation();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get username(): AbstractControl | null {
        return this.loginForm.get('username');
    }

    get password(): AbstractControl | null {
        return this.loginForm.get('password');
    }

    private setupFormValidation(): void {
        this.loginForm.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(
                    (prev, curr) =>
                        prev.username === curr.username &&
                        prev.password === curr.password
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    fetchLogin(): void {
        if (this.loginForm.invalid || this.loading$.value) {
            this.markFormAsTouched();
            return;
        }

        this.loading$.next(true);
        const credentials: LoginCredentials = this.loginForm
            .value as LoginCredentials;

        this.authService
            .OnLogin(credentials)
            .pipe(
                switchMap((response) => this.handleAuthResponse(response)),
                catchError((error) => this.handleAuthError(error)),
                finalize(() => this.loading$.next(false))
            )
            .subscribe();
    }

    private markFormAsTouched(): void {
        Object.values(this.loginForm.controls).forEach((control) => {
            control.markAsTouched();
        });
    }

    private handleAuthResponse(response: LoginResponse) {
        if (response.error === false) {
            return this.processSuccessfulAuth(response);
        } else {
            this.handleFailedAuth(response);
            return throwError(() => new Error(response.message));
        }
    }

    private processSuccessfulAuth(response: LoginResponse) {
        const user = response.data.user;
        const token = response.data.token;

        this.storeAuthData(user, token);

        this.toastr.success(`Bienvenue ${user.nom} ${user.prenoms}`);

        return this.authService.getVariables({}).pipe(
            tap((varsResponse) => this.handleVariablesResponse(varsResponse)),
            catchError((error) => {
                this.toastr.error('Erreur lors du chargement des variables');
                return of(null);
            }),
            finalize(() => this.router.navigateByUrl(`/${DASHBOARD}`))
        );
    }

    private storeAuthData(user: CurrentUser, token: AuthToken): void {
        // this.currentUserService.setCurrentUser(user);
        this.encodingService.saveData('user_data', user, true);
        this.encodingService.saveData('token_data', token, true);
        this.encodingService.saveData('menu', user.permissions, true);
    }

    private handleVariablesResponse(response: any): void {
        if (!response.error) {
            // this.featureService.setAsAccessFeature(response.data.modules);
            this.encodingService.saveData(
                'modules',
                response.data.modules,
                true
            );
            this.encodingService.saveData(
                'dashboard_links',
                response.data,
                true
            );
            // this.encodingService.saveData('dashboard_links', response.data, true); // a supprimer quand tout sera remplacer
        }
    }

    private handleFailedAuth(response: any): void {
        const errorMessage = response?.message || 'Erreur de connexion';
        this.toastr.error(errorMessage);
        this.loginForm.get('password')?.reset();
    }

    private handleAuthError(error: any) {
        const errorMessage =
            error?.error?.message ||
            "Une erreur est survenue lors de l'authentification";
        this.toastr.error(errorMessage);
        this.loginForm.get('password')?.reset();
        return throwError(() => error);
    }
}
