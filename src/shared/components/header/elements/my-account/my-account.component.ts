import {
    Component,
    DestroyRef,
    TemplateRef,
    computed,
    effect,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentUser } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TagModule } from 'primeng/tag';
import { interval, Subscription, takeWhile } from 'rxjs';

import {
    PasswordForm,
    ProfileForm,
    TwoFactorForm,
    createPasswordForm,
    createProfileForm,
    createTwoFactorForm,
} from './domain/controls/my-account-form.control';
import { LogoutFacade } from './application/facade/logout.facade';
import { ProfileUpdateFacade } from './application/facade/profile-update.facade';
import { AuthFacade } from './application/facade/auth.facade';
import { TwoFactorRequestFacade } from './application/facade/two-factor-request.facade';
import { TwoFactorEnableFacade } from './application/facade/two-factor-enable.facade';
import { TwoFactorDisableFacade } from './application/facade/two-factor-disable.facade';
import { PasswordChangeFacade } from './application/facade/password-change.facade';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

type AccountField = 'email' | 'firstName' | 'lastName' | 'phone';
type PasswordField = 'confirmNewPassword' | 'newPassword' | 'oldPassword';

@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.scss',
    imports: [
        ReactiveFormsModule,
        PasswordModule,
        InputMaskModule,
        TranslateModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        PasswordStrengthComponent,
    ],
})
export class MyAccountComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly profileUpdateFacade = inject(ProfileUpdateFacade);
    private readonly logoutFacade = inject(LogoutFacade);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly authFacade = inject(AuthFacade);
    private readonly twoFactorRequestFacade = inject(TwoFactorRequestFacade);
    private readonly twoFactorEnableFacade = inject(TwoFactorEnableFacade);
    private readonly twoFactorDisableFacade = inject(TwoFactorDisableFacade);
    private readonly passwordChangeFacade = inject(PasswordChangeFacade);
    private readonly feedback = inject(UiFeedbackService);
    private readonly modal = inject(NgbModal);
    private readonly sweetAlert = inject(SweetAlertService);

    private readonly passwordModalTemplate =
        viewChild<TemplateRef<unknown>>('passwordV');
    private readonly accountModalTemplate =
        viewChild<TemplateRef<unknown>>('accountV');
    private readonly doubleFactorModalTemplate =
        viewChild<TemplateRef<unknown>>('doubleFactorV');
    private cooldownSubscription: Subscription | null = null;

    readonly currentUser = signal<CurrentUser | null>(this.getStoredUser());
    readonly enable2fa = signal(this.currentUser()?.enable2fa ?? false);
    readonly isDropdownOpen = signal(false);
    readonly twoFaStep = signal<'status' | 'verification'>('status');
    readonly resendCooldown = signal(0);

    readonly accountForm: ProfileForm = createProfileForm();
    readonly passwordForm: PasswordForm = createPasswordForm(
        () => this.currentUser()?.email ?? ''
    );
    readonly twoFactorForm: TwoFactorForm = createTwoFactorForm();

    readonly twoFactorChallenge = computed(() =>
        this.twoFactorRequestFacade.items()
    );

    readonly loading = computed(
        () =>
            this.twoFactorRequestFacade.loading() ||
            this.twoFactorEnableFacade.loading() ||
            this.twoFactorDisableFacade.loading()
    );

    readonly accountLoading = computed(() =>
        this.profileUpdateFacade.loading()
    );
    readonly passwordLoading = computed(() =>
        this.passwordChangeFacade.loading()
    );

    constructor() {
        this.watchCompletion(
            () => this.twoFactorRequestFacade.state().lastFetch,
            () => {
                this.feedback.success('MY_ACCOUNT.2FA.CODE_SENT');
                this.startResendCooldown(
                    this.twoFactorRequestFacade.items()?.timeout ?? 30
                );
            }
        );
        this.watchCompletion(
            () => this.twoFactorEnableFacade.state().lastFetch,
            () => {
                this.persistUser(this.mergeCurrentUser({ enable2fa: true }));
                this.enable2fa.set(true);
                this.feedback.success('MY_ACCOUNT.2FA.ENABLED_SUCCESS');
                this.closeModal();
            }
        );
        this.watchCompletion(
            () => this.twoFactorDisableFacade.state().lastFetch,
            () => {
                this.persistUser(this.mergeCurrentUser({ enable2fa: false }));
                this.enable2fa.set(false);
                this.feedback.success('MY_ACCOUNT.2FA.DISABLED_SUCCESS');
                this.closeModal();
            }
        );
        this.watchCompletion(
            () => this.profileUpdateFacade.state().lastFetch,
            () => {
                this.persistCurrentProfile();
                this.feedback.success(
                    'MY_ACCOUNT.ACCOUNT.MESSAGES.SUCCESS.PROFILE_UPDATED'
                );
                this.closeModal();
            }
        );
        this.watchCompletion(
            () => this.passwordChangeFacade.state().lastFetch,
            () => {
                this.feedback.success(
                    'MY_ACCOUNT.PASSWORD.MESSAGES.SUCCESS.PASSWORD_UPDATED'
                );
                this.closeModal();
            }
        );
    }

    private watchCompletion(reader: () => number, onSuccess: () => void): void {
        let previous = reader();
        effect(() => {
            const current = reader();
            if (current > previous) {
                previous = current;
                onSuccess();
            }
        });
    }

    toggleDropdown(): void {
        this.isDropdownOpen.update((isOpen) => !isOpen);
    }

    closeDropdown(): void {
        this.isDropdownOpen.set(false);
    }

    openAccountModal(): void {
        this.closeDropdown();
        const user = this.currentUser();
        const template = this.accountModalTemplate();
        if (!user || !template) {
            return;
        }

        this.accountForm.reset({
            id: user.id,
            lastName: user.last_name,
            firstName: user.first_name,
            email: user.email,
            phone: user.phone,
        });
        this.openModal(template);
    }

    saveAccount(): void {
        if (this.accountForm.invalid) {
            this.accountForm.markAllAsTouched();
            return;
        }
        const raw = this.accountForm.getRawValue();
        this.profileUpdateFacade.execute({
            id: raw.id,
            lastName: raw.lastName,
            firstName: raw.firstName,
            phone: raw.phone,
        });
    }

    openPasswordModal(): void {
        this.closeDropdown();
        const template = this.passwordModalTemplate();
        if (!template) {
            return;
        }

        this.passwordForm.reset();
        this.openModal(template);
    }

    savePassword(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }
        const raw = this.passwordForm.getRawValue();
        this.passwordChangeFacade.execute({
            oldPassword: raw.oldPassword,
            newPassword: raw.newPassword,
            newPasswordConfirmation: raw.confirmNewPassword,
        });
    }

    protected openDoubleFactorModal(): void {
        this.closeDropdown();
        this.backToStatus();
        const template = this.doubleFactorModalTemplate();
        if (template) {
            this.openModal(template);
        }
    }

    requestTwoFactor(): void {
        const channel = this.twoFactorForm.controls.channel.value;
        this.twoFactorRequestFacade.execute({ channel });
        this.twoFaStep.set('verification');
        this.twoFactorForm.controls.code.reset();
    }

    resendCode(): void {
        if (this.resendCooldown() > 0 || this.loading()) {
            return;
        }
        this.requestTwoFactor();
    }

    verifyTwoFactor(): void {
        if (this.twoFactorForm.invalid) {
            this.twoFactorForm.markAllAsTouched();
            return;
        }

        this.twoFactorEnableFacade.execute({
            otp: this.twoFactorForm.controls.code.value,
            channel: this.twoFactorForm.controls.channel.value,
        });
    }

    async disableTwoFactor(): Promise<void> {
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'MY_ACCOUNT.2FA.DISABLE_CONFIRM_TITLE',
            messageKey: 'MY_ACCOUNT.2FA.DISABLE_CONFIRM_TEXT',
            confirmTextKey: 'COMMON.YES',
        });
        if (!confirmed) {
            return;
        }

        const user = this.currentUser();
        if (!user) {
            return;
        }

        this.twoFactorDisableFacade.execute({
            email: user.email,
        });
    }

    backToStatus(): void {
        this.twoFaStep.set('status');
        this.resendCooldown.set(0);
        this.twoFactorForm.reset();
        this.cooldownSubscription?.unsubscribe();
        this.cooldownSubscription = null;
    }

    closeModal(): void {
        this.modal.dismissAll();
        this.backToStatus();
        this.accountForm.reset();
        this.passwordForm.reset();
    }

    isAccountFieldInvalid(field: AccountField): boolean {
        const control = this.accountForm.controls[field];
        return control.invalid && control.touched;
    }

    isAccountFieldValid(field: AccountField): boolean {
        const control = this.accountForm.controls[field];
        return control.valid && control.touched;
    }

    isPasswordFieldInvalid(field: PasswordField): boolean {
        const control = this.passwordForm.controls[field];
        return control.invalid && control.touched;
    }

    isPasswordFieldValid(field: PasswordField): boolean {
        const control = this.passwordForm.controls[field];
        return control.valid && control.touched;
    }

    accountError(field: AccountField): string | null {
        const control = this.accountForm.controls[field];
        if (!control.errors || !control.touched) {
            return null;
        }
        if (control.errors['email']) {
            return 'MY_ACCOUNT.ACCOUNT.FORM.INVALID_FORMAT';
        }
        if (control.errors['pattern']) {
            return 'MY_ACCOUNT.ACCOUNT.FORM.INVALID_START';
        }
        return null;
    }

    passwordError(field: PasswordField): string | null {
        const control = this.passwordForm.controls[field];
        if (!control.errors || !control.touched) {
            return null;
        }
        // if (control.errors['weakPassword']) {
        //     return 'MY_ACCOUNT.PASSWORD.FORM.WEAK_PASSWORD';
        // }
        if (control.errors['emailAsPassword']) {
            return 'MY_ACCOUNT.PASSWORD.FORM.PASSWORD_EQUALS_EMAIL';
        }
        if (control.errors['oldPasswordUsed']) {
            return 'MY_ACCOUNT.PASSWORD.FORM.PASSWORD_EQUALS_OLD';
        }
        if (control.errors['minlength']) {
            return 'MY_ACCOUNT.PASSWORD.FORM.INVALID_FORMAT';
        }
        if (
            field === 'confirmNewPassword' &&
            this.passwordForm.hasError('notMatching')
        ) {
            return 'MY_ACCOUNT.PASSWORD.FORM.NOT_MATCH';
        }
        return null;
    }

    async logout(): Promise<void> {
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'LOGOUT.SWEET_ALERT_PARAMS.CONFIRM',
            messageKey: 'LOGOUT.SWEET_ALERT_PARAMS.MESSAGES',
            confirmTextKey: 'LOGOUT.SWEET_ALERT_PARAMS.BUTTONS',
        });
        if (!confirmed) {
            return;
        }
        this.logoutFacade.execute();
    }

    private openModal(template: TemplateRef<unknown>): void {
        this.modal.open(template, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
        });
    }

    private getStoredUser(): CurrentUser | null {
        return this.encodingDataService.getData(
            'user_data'
        ) as CurrentUser | null;
    }

    private mergeCurrentUser(patch: Partial<CurrentUser>): CurrentUser {
        return {
            ...(this.currentUser() as CurrentUser),
            ...patch,
        };
    }

    private persistUser(user: CurrentUser): void {
        this.encodingDataService.saveData('user_data', user);
        this.currentUser.set(user);
    }

    private persistCurrentProfile(): void {
        const user = this.currentUser();
        if (!user) {
            return;
        }
        const raw = this.accountForm.getRawValue();
        this.persistUser(
            this.mergeCurrentUser({
                last_name: raw.lastName.trim(),
                first_name: raw.firstName.trim(),
                phone: raw.phone.replace(/\D/g, ''),
            })
        );
    }

    private startResendCooldown(timeout = 30): void {
        this.cooldownSubscription?.unsubscribe();
        this.resendCooldown.set(timeout);
        this.cooldownSubscription = interval(1000)
            .pipe(
                takeWhile(() => this.resendCooldown() > 0),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.resendCooldown.update((value) => value - 1);
            });
    }
}
