import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { LoginStore } from '@presentation/pages/authentication/presentation/store/login/login.store';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { DASHBOARD } from '@shared/routes/routes';
import { AUTH } from '@presentation/app.routes';
import { FORGOT_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/features/forgot-password/forgot-password-paths.constants';
import { LOGIN_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/login/login-form-keys.constant';

import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        PasswordModule,
        TranslateModule,
        RouterLink,
    ],
    providers: [LoginStore],
})
export class LoginComponent {
    protected readonly store = inject(LoginStore);
    protected readonly appConfig = inject(AppCustomizationService);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly router = inject(Router);

    protected readonly KEYS = LOGIN_FORM_KEYS;
    protected readonly AUTH = AUTH;
    protected readonly FORGOT_PASSWORD_ROUTE = FORGOT_PASSWORD_ROUTE;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected readonly otpEmail = computed(() =>
        this.maskEmail(this.store.form.controls[this.KEYS.EMAIL].value)
    );

    private hasRedirected = false;
    private otpStepStarted = false;

    private maskEmail(email: string): string {
        if (!email || !email.includes('@')) {
            return email;
        }
        const [local, domain] = email.split('@');
        if (local.length <= 2) {
            return `${local.slice(0, 1)}***@${domain}`;
        }
        return `${local.slice(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`;
    }

    constructor() {
        effect(() => {
            const error = this.store.error();
            if (error) {
                this.store.resetPassword();
            }
        });
        effect(() => {
            const session = this.store.session();
            if (!session) {
                return;
            }

            if (session.requiresTwoFactor) {
                if (!this.otpStepStarted) {
                    this.otpStepStarted = true;
                    this.store.startOtpStep();
                }
                return;
            }

            if (this.hasRedirected) {
                return;
            }

            const user = session.user;
            const token = session.token;
            if (!user || !token) {
                return;
            }

            this.hasRedirected = true;
            this.storeUserAndToken(user, token);
            void this.router.navigate([DASHBOARD]);
        });
    }

    protected onSubmit(): void {
        this.store.submit();
    }

    protected onVerifyOtp(): void {
        this.store.verifyOtp();
    }

    protected onBackToCredentials(): void {
        this.otpStepStarted = false;
        this.store.backToCredentials();
    }

    private storeUserAndToken(user: CurrentUser, token: AuthToken): void {
        this.encodingDataService.saveData('user_data', user, true);
        this.encodingDataService.saveData('token_data', token, true);
        this.encodingDataService.saveData('menu', user.permissions, true);
        this.encodingDataService.saveData(
            'permissionsActions',
            user.actions,
            true
        );
    }
}
