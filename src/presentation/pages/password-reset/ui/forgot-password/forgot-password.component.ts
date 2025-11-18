import { CommonModule, Location } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordResetFacade } from '@pages/password-reset/application/password-reset.facade';
import { ForgotPasswordFormInterface } from '@pages/password-reset/data/interfaces/forgot-password-form.interface';
import { LOGO_ANSUT } from '@shared/constants/logoAnsut.constant';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnDestroy {
    public readonly LOGO_ANSUT = LOGO_ANSUT;
    public isEmailSent = false;

    public forgotPasswordForm = new FormGroup<ForgotPasswordFormInterface>({
        email: new FormControl('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
        }),
    });

    private destroy$ = new Subject<void>();
    public readonly config = inject(AppCustomizationService).config;
    public readonly isForgotPasswordLoading$ =
        this.passwordResetFacade.isForgotPasswordLoading$;

    constructor(
        private readonly passwordResetFacade: PasswordResetFacade,
        private readonly location: Location
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get email(): AbstractControl<string> | null {
        return this.forgotPasswordForm.get('email');
    }

    public isFieldInvalid(fieldName: 'email'): boolean {
        const control = this.forgotPasswordForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    public getFieldError(fieldName: 'email'): string | null {
        const control = this.forgotPasswordForm.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        if (control.errors['required']) {
            return 'PASSWORD_RESET.FORM.EMAIL.REQUIRED';
        }

        if (control.errors['email']) {
            return 'PASSWORD_RESET.FORM.EMAIL.INVALID_FORMAT';
        }

        return null;
    }

    public onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            this.markFormAsTouched();
            return;
        }

        const formValue = this.forgotPasswordForm.getRawValue();

        this.passwordResetFacade
            .forgotPassword(formValue)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isEmailSent = true;
                },
                error: () => {
                    // Error handled in facade
                },
            });
    }

    public onResendEmail(): void {
        this.isEmailSent = false;
        this.forgotPasswordForm.reset();
    }

    public onCancel(): void {
        this.location.back();
    }

    private markFormAsTouched(): void {
        for (const control of Object.values(this.forgotPasswordForm.controls)) {
            control.markAsTouched();
        }
    }
}
