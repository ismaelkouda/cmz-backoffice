import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LOGO_ANSUT } from '../../../../../shared/constants/logoAnsut.constant';
import {
    AuthToken,
    CurrentUser,
} from '../../../../../shared/interfaces/current-user.interface';
import { DASHBOARD } from '../../../../../shared/routes/routes';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { EnvService } from '../../../../../shared/services/env.service';
import { REINITIALIZATION } from '../../../../app-routing.module';
import { FORGOT_PASSWORD } from '../../../password-reset/password-reset-routing.module';
import { AuthenticationService } from '../../data-access/authentication.service';
import { LoginCredentialsInterface } from '../../data-access/interfaces/login-credentials-interface';
import { LoginPayloadInterface } from '../../data-access/interfaces/login-payload.interface';
import { LoginResponseInterface } from '../../data-access/interfaces/login-response.interface';
import { VariablesResponseInterface } from './../../data-access/interfaces/variables-response.interface';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule, PasswordModule, TranslateModule, RouterLink],
})
export class LoginComponent implements OnInit, OnDestroy {
    public apiError: string | null = null;
    public readonly REINITIALIZATION = REINITIALIZATION;
    public readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    public readonly LOGO_ANSUT = LOGO_ANSUT;

    public loginForm = new FormGroup<LoginPayloadInterface>({
        username: new FormControl('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
        }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
    });

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private encodingService: EncodingDataService,
        private envService: EnvService
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

    public onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormAsTouched();
            return;
        }

        const credentials: LoginCredentialsInterface = this.loginForm
            .value as LoginCredentialsInterface;
        this.authService
            .fetchLogin(credentials, (error) => this.handleAuthError(error))
            .pipe(takeUntil(this.destroy$))
            .subscribe((loginResponse: LoginResponseInterface) => {
                if (loginResponse && loginResponse.error === false) {
                    const data =
                        loginResponse.data ??
                        ({} as { user?: CurrentUser; token?: AuthToken });
                    const { user, token } = data as {
                        user?: CurrentUser;
                        token?: AuthToken;
                    };
                    if (user && token) {
                        this.storeUserAndToken(user, token);
                        this.handleFetchVariables();
                    }
                }
            });
    }

    private handleAuthError(error: any) {
        this.apiError = `${error.error.message}`;
        this.loginForm.get('password')?.reset();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.loginForm.controls)) {
            control.markAsTouched();
        }
    }

    private handleFetchVariables(): void {
        this.authService
            .fetchVariables()
            .subscribe((variablesResponse: VariablesResponseInterface) => {
                if (variablesResponse?.error === false) {
                    this.handleVariablesResponse(variablesResponse);
                    this.router.navigate([DASHBOARD]);
                }
            });
    }

    private storeUserAndToken(user: CurrentUser, token: AuthToken): void {
        this.encodingService.saveData('user_data', user, true);
        this.encodingService.saveData('token_data', token, true);
        this.encodingService.saveData('menu', user.permissions, true);
    }

    private handleVariablesResponse(
        response: VariablesResponseInterface
    ): void {
        this.encodingService.saveData('modules', response.data.modules, true);
        this.encodingService.saveData('dashboard_links', response.data, true);
    }
}
