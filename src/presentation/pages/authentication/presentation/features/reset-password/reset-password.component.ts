import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { AUTH } from '@presentation/app.routes';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PasswordModule } from 'primeng/password';
import { map } from 'rxjs/operators';
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
export class ResetPasswordComponent {
    protected readonly store = inject(ResetPasswordStore);
    protected readonly appConfig = inject(AppCustomizationService);
    private readonly ui = inject(UiFeedbackService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly KEYS = RESET_PASSWORD_FORM_KEYS;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected readonly token = computed(() => this.getQueryParam('token'));
    protected readonly email = computed(() => this.getQueryParam('email'));

    private getQueryParam(key: string): string {
        const params = this.queryParams() as Record<string, string>;
        return params[key] ?? '';
    }
    private readonly queryParams = toSignal(
        this.route.queryParams.pipe(map((params: Params) => params)),
        { initialValue: {} }
    );

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
