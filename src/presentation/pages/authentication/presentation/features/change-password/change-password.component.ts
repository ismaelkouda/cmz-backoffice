import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { FORGOT_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/features/forgot-password/forgot-password-paths.constants';
import { AUTH } from '@presentation/app.routes';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PasswordModule } from 'primeng/password';
import { ChangePasswordStore } from '@presentation/pages/authentication/presentation/store/change-password/change-password.store';
import { CHANGE_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-keys.constant';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';

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

    protected readonly KEYS = CHANGE_PASSWORD_FORM_KEYS;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected readonly tokenInvalid = signal(false);

    private hasRedirected = false;
    private tokenValue = '';

    constructor() {
        effect(() => {
            if (this.store.error() && !this.store.loading()) {
                this.tokenInvalid.set(true);
            }
        });

        effect(() => {
            const session = this.store.session();
            if (!session || this.hasRedirected) {
                return;
            }
            this.hasRedirected = true;
            this.ui.success(session.message);
            this.goToLogin();
        });
    }

    ngOnInit(): void {
        this.tokenValue = this.asString(
            this.route.snapshot.queryParams['token']
        );

        if (this.route.snapshot.queryParams['token'] !== undefined) {
            const url = new URL(globalThis.location.href);
            url.searchParams.delete('token');
            globalThis.history.replaceState(null, '', url.toString());
        }

        if (!this.tokenValue) {
            this.tokenInvalid.set(true);
        }
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
        this.router.navigate(['/', AUTH, FORGOT_PASSWORD_ROUTE]);
    }

    protected goToLogin(): void {
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }
}
