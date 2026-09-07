import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginFacade } from '@presentation/pages/authentication/application/services/login/login.facade';
import { ValidateOtpFacade } from '@presentation/pages/authentication/application/services/verify-otp/validate-otp.facade';
import { LoginFormControl } from '@presentation/pages/authentication/presentation/store/login/login-form.control';
import { LoginFormValue } from '@presentation/pages/authentication/presentation/store/login/login-form.value';
import { LOGIN_FORM_ERROR_MESSAGES } from '@presentation/pages/authentication/presentation/constants/login/login-form-error-messages.constant';
import { LOGIN_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/login/login-form-keys.constant';
import { FormValidators } from '@presentation/pages/authentication/presentation/constants/form-validators.constants';
import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
import { startWith } from 'rxjs';

export type LoginStep = 'credentials' | 'otp';

@Injectable()
export class LoginStore {
    private readonly fb = inject(FormBuilder);
    private readonly loginFacade = inject(LoginFacade);
    private readonly validateOtpFacade = inject(ValidateOtpFacade);

    public readonly step = signal<LoginStep>('credentials');
    public readonly otpCooldown = signal(0);
    public readonly otpExpiredAt = signal<string | null>(null);

    public readonly VALIDATION = FormValidators;

    public readonly form: FormGroup<LoginFormControl> =
        this.fb.nonNullable.group({
            [LOGIN_FORM_KEYS.EMAIL]: [
                '',
                [
                    Validators.required,
                    Validators.pattern(FormValidators.EMAIL.PATTERN),
                ],
            ],
            [LOGIN_FORM_KEYS.PASSWORD]: ['', [Validators.required]],
        });

    public readonly otpForm = this.fb.nonNullable.group({
        otp: [
            '',
            [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(4),
                Validators.pattern(/^\d+$/),
            ],
        ],
    });

    public readonly loading = computed(
        () => this.loginFacade.loading() || this.validateOtpFacade.loading()
    );

    public readonly error = computed(
        () => this.loginFacade.error() || this.validateOtpFacade.error()
    );

    public readonly session = computed(
        () => this.validateOtpFacade.items() ?? this.loginFacade.items()
    );

    private readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isValid = computed(() => this.status() === 'VALID');

    private readonly otpStatus = toSignal(
        this.otpForm.statusChanges.pipe(startWith(this.otpForm.status)),
        { initialValue: this.otpForm.status }
    );
    public readonly isOtpValid = computed(() => this.otpStatus() === 'VALID');

    private get value(): LoginFormValue {
        return this.form.getRawValue();
    }

    public submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loginFacade.execute(this.value);
    }

    public verifyOtp(): void {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        const email = this.form.controls[LOGIN_FORM_KEYS.EMAIL].value;
        this.validateOtpFacade.execute({
            email,
            otp: this.otpForm.controls.otp.value,
        });
    }

    public startOtpStep(): void {
        this.step.set('otp');
        this.otpForm.reset();
        const challenge = this.loginFacade.items()?.challenge;
        console.log('this.loginFacade.items()', challenge);
        this.otpExpiredAt.set(challenge?.expiredAt ?? null);
        this.otpCooldown.set(challenge?.timeout ?? 0);
        this.startCooldown();
    }

    public resendOtp(): void {
        if (this.otpCooldown() > 0) {
            return;
        }
        this.submit();
        this.otpCooldown.set(30);
        this.startCooldown();
    }

    public backToCredentials(): void {
        this.step.set('credentials');
        this.otpCooldown.set(0);
        this.otpExpiredAt.set(null);
        this.otpForm.reset();
        this.loginFacade.reset();
        this.validateOtpFacade.reset();
        this.stopCooldown();
    }

    private cooldownTimer: ReturnType<typeof setInterval> | null = null;

    private startCooldown(): void {
        this.stopCooldown();
        if (this.otpCooldown() <= 0) {
            return;
        }
        this.cooldownTimer = setInterval(() => {
            this.otpCooldown.update((value) => {
                const next = value - 1;
                if (next <= 0) {
                    this.stopCooldown();
                }
                return Math.max(next, 0);
            });
        }, 1000);
    }

    private stopCooldown(): void {
        if (this.cooldownTimer !== null) {
            clearInterval(this.cooldownTimer);
            this.cooldownTimer = null;
        }
    }

    public resetPassword(): void {
        this.form.controls.password.setValue('');
    }

    public isFieldInvalid(field: keyof LoginFormControl): boolean {
        const control = this.form.controls[field];
        return control.invalid && control.touched;
    }

    public isFieldValid(field: keyof LoginFormControl): boolean {
        const control = this.form.controls[field];
        return control.valid && control.touched;
    }

    public isFieldTouched(field: keyof LoginFormControl): boolean {
        const control = this.form.controls[field];
        return control.touched;
    }

    public getFieldError(field: keyof LoginFormControl): string | null {
        return getControlError(
            this.form.controls[field],
            LOGIN_FORM_ERROR_MESSAGES[field]
        );
    }
}
