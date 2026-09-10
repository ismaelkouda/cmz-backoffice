import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { AUTH } from '@presentation/app.routes';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PasswordModule } from 'primeng/password';
import { ResetPasswordStore } from '@presentation/pages/authentication/presentation/store/reset-password/reset-password.store';
import { RESET_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form-keys.constant';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    providers: [ResetPasswordStore],
    imports: [
        ReactiveFormsModule,
        PasswordModule,
        TranslateModule,
        PasswordStrengthComponent,
    ],
})
export class ResetPasswordComponent implements OnInit {
    protected readonly store = inject(ResetPasswordStore);
    protected readonly appConfig = inject(AppCustomizationService);
    private readonly ui = inject(UiFeedbackService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly KEYS = RESET_PASSWORD_FORM_KEYS;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    private tokenValue = '';
    private emailValue = '';

    protected readonly token = computed(() => this.tokenValue);
    protected readonly email = computed(() => this.emailValue);

    ngOnInit(): void {
        const initial = this.route.snapshot.queryParams;
        this.tokenValue = this.asString(initial['token']);
        this.emailValue = this.asString(initial['email']);

        if (initial['token'] !== undefined || initial['email'] !== undefined) {
            const url = new URL(globalThis.location.href);
            url.searchParams.delete('token');
            url.searchParams.delete('email');
            globalThis.history.replaceState(null, '', url.toString());
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

    private hasRedirected = false;

    constructor() {
        effect(() => {
            this.store.setValidationEmail(this.email());
        });

        effect(() => {
            const session = this.store.session();
            if (!session || this.hasRedirected) {
                return;
            }
            this.hasRedirected = true;
            if (session.message) {
                this.ui.success(session.message);
            }
            this.goToLogin();
        });
    }

    protected onSubmit(): void {
        this.store.submit(this.token(), this.email());
    }

    public onCancel(): void {
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }

    private goToLogin(): void {
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }
}
