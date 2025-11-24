import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationFacade } from '@pages/authentication/application/authentication.facade';
import { LoginFormInterface } from '@pages/authentication/data/interfaces/login-form.interface';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
import { FORGOT_PASSWORD } from '@pages/password-reset/password-reset.routes';
import { REINITIALIZATION } from '@presentation/app.routes';
import { LOGO_ANSUT } from '@shared/constants/logoAnsut.constant';
import {
    AuthToken,
    CurrentUser,
} from '@shared/interfaces/current-user.interface';
import { DASHBOARD } from '@shared/routes/routes';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { EncodingDataService } from '@shared/services/encoding-data.service';
import { PasswordModule } from 'primeng/password';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PasswordModule,
        TranslateModule,
        RouterLink,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
    private readonly authenticationFacade = inject(AuthenticationFacade);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly router = inject(Router);
    public readonly REINITIALIZATION = REINITIALIZATION;
    public readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    public readonly LOGO_ANSUT = LOGO_ANSUT;

    public loginForm = new FormGroup<LoginFormInterface>({
        email: new FormControl('', {
            validators: [
                Validators.required,
                Validators.email,
                Validators.minLength(6),
            ],
            nonNullable: true,
        }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
    });

    private destroy$ = new Subject<void>();
    public readonly config = inject(AppCustomizationService).config;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get email(): AbstractControl<string> | null {
        return this.loginForm.get('email');
    }

    get password(): AbstractControl<string> | null {
        return this.loginForm.get('password');
    }

    public isFieldInvalid(fieldName: 'email' | 'password'): boolean {
        const control = this.loginForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    public isFieldValid(fieldName: 'email' | 'password'): boolean {
        const control = this.loginForm.get(fieldName);
        return !!(control && control.valid && control.touched);
    }

    public getFieldError(fieldName: 'email' | 'password'): string | null {
        const control = this.loginForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['required']) {
            return fieldName === 'email'
                ? 'AUTHENTICATION.FORM.EMAIL.REQUIRED'
                : 'AUTHENTICATION.FORM.PASSWORD.REQUIRED';
        }

        if (control.errors['email']) {
            return 'AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT';
        }

        if (control.errors['minlength']) {
            return fieldName === 'email'
                ? 'AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT'
                : 'AUTHENTICATION.FORM.PASSWORD.REQUIRED';
        }

        return null;
    }

    public onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormAsTouched();
            return;
        }

        const credentials = this.loginForm.getRawValue();

        this.authenticationFacade
            .login(credentials)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (session: AuthSession) =>
                    this.handleSuccessfulLogin(session),
                error: () => this.handleAuthError(),
            });
    }

    private handleSuccessfulLogin(session: AuthSession): void {
        const { user, token } = session;
        if (user && token) {
            this.storeUserAndToken(user, token);
            this.router.navigate([DASHBOARD]);
        }
    }

    private handleAuthError(): void {
        this.loginForm.get('password')?.reset();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.loginForm.controls)) {
            control.markAsTouched();
        }
    }

    private storeUserAndToken(user: CurrentUser, token: AuthToken): void {
        this.encodingDataService.saveData('user_data', user, true);
        this.encodingDataService.saveData('token_data', token, true);
        this.encodingDataService.saveData('menu', user.permissions, true);
    }
}
