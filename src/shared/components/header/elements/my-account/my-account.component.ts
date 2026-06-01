import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    TemplateRef,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { CurrentUser } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TagModule } from 'primeng/tag';
import { interval, Subscription, takeWhile } from 'rxjs';
import SweetAlert from 'sweetalert2';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { MyAccountFacade } from './application/my-account.facade';
import {
    PasswordForm,
    ProfileForm,
    TwoFactorForm,
    createPasswordForm,
    createProfileForm,
    createTwoFactorForm,
} from './domain/controls/my-account-form.control';

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
        ToggleButtonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAccountComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly feedback = inject(UiFeedbackService);
    private readonly translate = inject(TranslateService);
    private readonly facade = inject(MyAccountFacade);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly modal = inject(NgbModal);

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
    readonly loading = this.facade.loading;
    // readonly twoFactorChallenge = this.facade.twoFactorChallenge;

    readonly accountForm: ProfileForm = createProfileForm();
    readonly passwordForm: PasswordForm = createPasswordForm();
    readonly twoFactorForm: TwoFactorForm = createTwoFactorForm();

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

        const payload = this.accountForm.getRawValue();
        this.facade
            .updateProfile(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                const updatedUser = this.mergeCurrentUser({
                    last_name: payload.lastName,
                    first_name: payload.firstName,
                    email: payload.email,
                    phone: payload.phone,
                });
                this.persistUser(updatedUser);
                this.feedback.success(
                    'MY_ACCOUNT.MESSAGES.SUCCESS.PROFILE_UPDATED'
                );
                this.closeModal();
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

        const form = this.passwordForm.getRawValue();
        this.facade
            .updatePassword({
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
                newPasswordConfirmation: form.confirmNewPassword,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.feedback.success(
                    'MY_ACCOUNT.MESSAGES.SUCCESS.PASSWORD_UPDATED'
                );
                this.closeModal();
            });
    }

    protected openDoubleFactorModal(): void {
        this.closeDropdown();
        // this.backToStatus();
        const template = this.doubleFactorModalTemplate();
        if (template) {
            this.openModal(template);
        }
    }

    // requestTwoFactor(): void {
    //     const user = this.currentUser();
    //     if (!user) {
    //         return;
    //     }
    //     this.facade
    //         .requestTwoFactor({ userId: user.id, email: user.email })
    //         .pipe(takeUntilDestroyed(this.destroyRef))
    //         .subscribe((challenge) => {
    //             this.facade.setTwoFactorChallenge(challenge);
    //             this.twoFaStep.set('verification');
    //             this.twoFactorForm.reset();
    //             this.startResendCooldown();
    //             this.feedback.success('MY_ACCOUNT.2FA.CODE_SENT');
    //         });
    // }

    // resendCode(): void {
    //     if (this.resendCooldown() > 0 || this.loading()) {
    //         return;
    //     }
    //     this.requestTwoFactor();
    // }

    // verifyTwoFactor(): void {
    //     const user = this.currentUser();
    //     if (!user || this.twoFactorForm.invalid) {
    //         this.twoFactorForm.markAllAsTouched();
    //         return;
    //     }

    //     this.facade
    //         .verifyTwoFactor({
    //             userId: user.id,
    //             email: user.email,
    //             code: this.twoFactorForm.controls.code.value,
    //         })
    //         .pipe(takeUntilDestroyed(this.destroyRef))
    //         .subscribe(() => {
    //             this.persistUser(this.mergeCurrentUser({ enable2fa: true }));
    //             this.enable2fa.set(true);
    //             this.feedback.success('MY_ACCOUNT.2FA.ENABLED_SUCCESS');
    //             this.closeModal();
    //         });
    // }

    // disableTwoFactor(): void {
    //     SweetAlert.fire({
    //         title: this.translate.instant(
    //             'MY_ACCOUNT.2FA.DISABLE_CONFIRM_TITLE'
    //         ),
    //         text: this.translate.instant('MY_ACCOUNT.2FA.DISABLE_CONFIRM_TEXT'),
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: this.translate.instant('COMMON.YES'),
    //         cancelButtonText: this.translate.instant('COMMON.CANCEL'),
    //     }).then((result) => {
    //         const user = this.currentUser();
    //         if (!result.isConfirmed || !user) {
    //             return;
    //         }

    //         this.facade
    //             .disableTwoFactor({ userId: user.id, email: user.email })
    //             .pipe(takeUntilDestroyed(this.destroyRef))
    //             .subscribe(() => {
    //                 this.persistUser(
    //                     this.mergeCurrentUser({ enable2fa: false })
    //                 );
    //                 this.enable2fa.set(false);
    //                 this.feedback.success('MY_ACCOUNT.2FA.DISABLED_SUCCESS');
    //                 this.closeModal();
    //             });
    //     });
    // }

    // backToStatus(): void {
    //     this.twoFaStep.set('status');
    //     this.resendCooldown.set(0);
    //     this.twoFactorForm.reset();
    //     this.facade.setTwoFactorChallenge(null);
    //     this.cooldownSubscription?.unsubscribe();
    //     this.cooldownSubscription = null;
    // }

    closeModal(): void {
        this.modal.dismissAll();
        // this.backToStatus();
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

    logout(): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant('LOGOUT.SWEET_ALERT_PARAMS.CONFIRM'),
            text: this.translate.instant('LOGOUT.SWEET_ALERT_PARAMS.MESSAGES'),
            confirmButtonText: this.translate.instant(
                'LOGOUT.SWEET_ALERT_PARAMS.BUTTONS'
            ),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }
            this.facade
                .logout()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.encodingDataService.clearEncryptedData();
                    this.closeDropdown();
                    globalThis.window.location.reload();
                });
        });
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

    private startResendCooldown(): void {
        this.cooldownSubscription?.unsubscribe();
        this.resendCooldown.set(30);
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
