import { CommonModule } from '@angular/common';
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
import { REINITIALIZATION } from '../../../../../presentation/app.routes';
import { LOGO_ANSUT } from '../../../../../shared/constants/logoAnsut.constant';
import {
    AuthToken,
    CurrentUser,
} from '../../../../../shared/interfaces/current-user.interface';
import { DASHBOARD } from '../../../../../shared/routes/routes';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { FORGOT_PASSWORD } from '../../../password-reset/password-reset-routing.module';
import { AuthenticationService } from '../../data-access/authentication.service';
import { LoginCredential } from '../../data-access/credentials/login.credential';
import { LoginFormInterface } from '../../data-access/interfaces/login-form.interface';
import { LoginResponseInterface } from '../../data-access/interfaces/login-response.interface';
import { loginProviders } from '../../data-access/providers/login.providers';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [...loginProviders],
    imports: [CommonModule, ReactiveFormsModule, PasswordModule, TranslateModule, RouterLink],
})
export class LoginComponent implements OnInit, OnDestroy {
    public readonly REINITIALIZATION = REINITIALIZATION;
    public readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    public readonly LOGO_ANSUT = LOGO_ANSUT;

    public loginForm = new FormGroup<LoginFormInterface>({
        email: new FormControl(null, {
            validators: [Validators.required, Validators.email,  Validators.minLength(6)],
            nonNullable: true,
        }),
        password: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
    });

    private destroy$ = new Subject<void>();

    constructor(private authService: AuthenticationService,
        private router: Router,
        private encodingService: EncodingDataService,
    ) {}

    ngOnInit(): void {
        this.setupFormValidation();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get email(): AbstractControl | null {
        return this.loginForm.get('email');
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
                        prev.email === curr.email &&
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

        const credentials: LoginCredential = this.loginForm.value as LoginCredential;
        this.authService
            .fetchLogin(credentials, (error) => this.handleAuthError(error))
            .pipe(takeUntil(this.destroy$))
            .subscribe((loginResponse: LoginResponseInterface) => {
                        console.log("loginResponse", loginResponse)
                if (loginResponse && loginResponse.error === false) {
                    const data = loginResponse.data ??
                        ({} as { user?: CurrentUser; token?: AuthToken });
                    const { user, token } = data as {
                        user?: CurrentUser;
                        token?: AuthToken;
                    };
                    if (user && token) {
                        this.storeUserAndToken(user, token);
                        this.router.navigate([DASHBOARD]);
                    }
                }
            });
    }

    private handleAuthError(error: any) {
        this.loginForm.get('password')?.reset();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.loginForm.controls)) {
            control.markAsTouched();
        }
    }

    private storeUserAndToken(user: CurrentUser, token: AuthToken): void {
        this.encodingService.saveData('user_data', user, true);
        this.encodingService.saveData('token_data', token, true);
        this.encodingService.saveData('menu', user.permissions, true);
    }
}
