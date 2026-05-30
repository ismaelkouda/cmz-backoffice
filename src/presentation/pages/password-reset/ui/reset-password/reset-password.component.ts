import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LOGIN } from '@pages/authentication/authentication.routes';
import { PasswordResetFacade } from '@pages/password-reset/application/password-reset.facade';
import { ResetPasswordFormInterface } from '@pages/password-reset/data/interfaces/reset-password-form.interface';
import { AUTH } from '@presentation/app.routes';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PasswordModule } from 'primeng/password';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { EnvService } from '../../../../../core/config/env.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [ReactiveFormsModule, PasswordModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
    private readonly appConfig = inject(EnvService);
    private readonly passwordResetFacade = inject(PasswordResetFacade);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    public readonly LOGO_ANSUT = this.appConfig.appSettings['authLogo'];
    private readonly token: Signal<string> = toSignal(
        this.route.queryParams.pipe(map((params: Params) => params['token'])),
        { initialValue: '' }
    );

    public readonly email: Signal<string> = toSignal(
        this.route.queryParams.pipe(map((params: Params) => params['email'])),
        { initialValue: '' }
    );

    public resetPasswordForm = new FormGroup<ResetPasswordFormInterface>({
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
        confirm_password: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true,
        }),
    });

    public readonly config = inject(AppCustomizationService).customization;
    readonly isResetPasswordLoading = toSignal(
        this.passwordResetFacade.isResetPasswordLoading$,
        {
            initialValue: false,
        }
    );

    ngOnInit(): void {
        this.setupFormValidation();
        this.setupPasswordMatchValidator();
    }

    get password(): AbstractControl<string> | null {
        return this.resetPasswordForm.get('password');
    }

    get confirmPassword(): AbstractControl<string> | null {
        return this.resetPasswordForm.get('confirm_password');
    }

    public isFieldInvalid(fieldName: 'password' | 'confirm_password'): boolean {
        const control = this.resetPasswordForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    public getFieldError(
        fieldName: 'password' | 'confirm_password'
    ): string | null {
        const control = this.resetPasswordForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['required']) {
            return fieldName === 'password'
                ? 'PASSWORD_RESET.FORM.PASSWORD.REQUIRED'
                : 'PASSWORD_RESET.FORM.CONFIRM_PASSWORD.REQUIRED';
        }

        if (control.errors['minlength']) {
            return 'PASSWORD_RESET.FORM.PASSWORD.MIN_LENGTH';
        }

        if (control.errors['passwordMismatch']) {
            return 'PASSWORD_RESET.FORM.PASSWORD.MISMATCH';
        }

        return null;
    }

    public isPasswordMismatch(): boolean {
        const password = this.password?.value;
        const confirmPassword = this.confirmPassword?.value;
        return (
            !!password &&
            !!confirmPassword &&
            password !== confirmPassword &&
            this.confirmPassword?.touched
        );
    }

    private setupFormValidation(): void {
        this.resetPasswordForm.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(
                    (prev, curr) =>
                        prev.password === curr.password &&
                        prev.confirm_password === curr.confirm_password
                )
            )
            .subscribe(() => {
                this.updatePasswordMatchValidator();
            });
    }

    private setupPasswordMatchValidator(): void {
        this.updatePasswordMatchValidator();
    }

    private updatePasswordMatchValidator(): void {
        const password = this.password?.value;
        const confirmPassword = this.confirmPassword?.value;

        if (password && confirmPassword && password !== confirmPassword) {
            this.confirmPassword?.setErrors({ passwordMismatch: true });
        } else if (this.confirmPassword?.hasError('passwordMismatch')) {
            const errors = { ...this.confirmPassword.errors };
            delete errors['passwordMismatch'];
            this.confirmPassword.setErrors(
                Object.keys(errors).length > 0 ? errors : null
            );
        }
    }

    public onSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.markFormAsTouched();
            return;
        }

        const formValue = this.resetPasswordForm.getRawValue();

        this.passwordResetFacade
            .resetPassword({
                password: formValue.password,
                confirmPassword: formValue.confirm_password,
                token: this.token(),
                email: this.email(),
            })
            .subscribe({
                next: () => {
                    this.redirectToLogin();
                },
                error: () => {
                    // Error handled in facade
                },
            });
    }

    public onCancel(): void {
        this.resetPasswordForm.reset();
        this.redirectToLogin();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.resetPasswordForm.controls)) {
            control.markAsTouched();
        }
    }

    private redirectToLogin(): void {
        this.router.navigate([`/${AUTH}/${LOGIN}`]);
    }
}
