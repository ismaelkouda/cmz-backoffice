import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { AUTH } from '@presentation/app.routes';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PasswordModule } from 'primeng/password';
import { ChangePasswordStore } from '@presentation/pages/authentication/presentation/store/change-password/change-password.store';
import { CHANGE_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-keys.constant';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { ResendDefineFacade } from '@presentation/pages/authentication/application/services/resend-define/resend-define.facade';

@Component({
    selector: 'app-change-password',
    standalone: true,
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    providers: [ChangePasswordStore],
    imports: [
        ReactiveFormsModule,
        PasswordModule,
        TranslateModule,
        PasswordStrengthComponent,
    ],
})
export class ChangePasswordComponent implements OnInit {
    protected readonly store = inject(ChangePasswordStore);
    protected readonly appConfig = inject(AppCustomizationService);
    private readonly ui = inject(UiFeedbackService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly resendDefine = inject(ResendDefineFacade);

    protected readonly KEYS = CHANGE_PASSWORD_FORM_KEYS;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected readonly tokenInvalid = signal(false);

    private static readonly STORAGE_KEY_TOKEN = 'cp-token';
    private static readonly STORAGE_KEY_EMAIL = 'cp-email';
    private static readonly STORAGE_KEY_INVALID = 'cp-token-invalid';

    private hasRedirected = false;
    private hasRedirectedResend = false;
    private tokenValue = '';
    private emailValue = '';

    constructor() {
        effect(() => {
            if (this.store.error() && !this.store.loading()) {
                sessionStorage.setItem(
                    ChangePasswordComponent.STORAGE_KEY_INVALID,
                    'true'
                );
                this.tokenInvalid.set(true);
            }
        });

        effect(() => {
            const session = this.store.session();
            if (!session || this.hasRedirected) {
                return;
            }
            this.hasRedirected = true;
            ChangePasswordComponent.clearSecureStorage();
            this.ui.success(session.message);
            this.goToLogin();
        });

        effect(() => {
            const session = this.resendDefine.items();
            if (!session || this.hasRedirectedResend) {
                return;
            }
            this.hasRedirectedResend = true;
            this.ui.success(session.message);
            this.goToLogin();
        });
    }

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParams;
        const urlToken = this.asString(queryParams['token']);
        const urlEmail = this.asString(queryParams['email']);

        if (urlToken) {
            sessionStorage.setItem(
                ChangePasswordComponent.STORAGE_KEY_TOKEN,
                urlToken
            );
            sessionStorage.setItem(
                ChangePasswordComponent.STORAGE_KEY_EMAIL,
                urlEmail
            );
            sessionStorage.removeItem(
                ChangePasswordComponent.STORAGE_KEY_INVALID
            );
        }

        this.tokenValue =
            urlToken ||
            sessionStorage.getItem(ChangePasswordComponent.STORAGE_KEY_TOKEN) ||
            '';
        this.emailValue =
            urlEmail ||
            sessionStorage.getItem(ChangePasswordComponent.STORAGE_KEY_EMAIL) ||
            '';

        if (
            queryParams['token'] !== undefined ||
            queryParams['email'] !== undefined
        ) {
            const url = new URL(globalThis.location.href);
            url.searchParams.delete('token');
            url.searchParams.delete('email');
            globalThis.history.replaceState(null, '', url.toString());
        }

        const tokenInvalidWhileRefreshing =
            sessionStorage.getItem(
                ChangePasswordComponent.STORAGE_KEY_INVALID
            ) === 'true';

        if (!this.tokenValue || tokenInvalidWhileRefreshing) {
            this.tokenInvalid.set(true);
        }
    }

    private static clearSecureStorage(): void {
        sessionStorage.removeItem(ChangePasswordComponent.STORAGE_KEY_TOKEN);
        sessionStorage.removeItem(ChangePasswordComponent.STORAGE_KEY_EMAIL);
        sessionStorage.removeItem(ChangePasswordComponent.STORAGE_KEY_INVALID);
    }

    private asString(
        value: string | readonly string[] | null | undefined
    ): string {
        if (Array.isArray(value)) {
            return value[0] ?? '';
        }
        return typeof value === 'string' ? value : '';
    }

    protected onSubmit(): void {
        this.store.submit(this.tokenValue);
    }

    protected requestNewLink(): void {
        this.resendDefine.execute({
            token: this.tokenValue,
            email: this.emailValue,
        });
    }

    protected goToLogin(): void {
        ChangePasswordComponent.clearSecureStorage();
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }
}
