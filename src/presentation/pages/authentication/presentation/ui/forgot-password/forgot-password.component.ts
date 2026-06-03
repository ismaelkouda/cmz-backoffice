import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ForgotPasswordStore } from '@presentation/pages/authentication/presentation/store/forgot-password/forgot-password.store';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/constants/login/login-routes.constant';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    providers: [ForgotPasswordStore],
    imports: [ReactiveFormsModule, TranslateModule, RouterLink],
})
export class ForgotPasswordComponent {
    protected readonly store = inject(ForgotPasswordStore);
    protected readonly appConfig = inject(AppCustomizationService);
    private readonly router = inject(Router);

    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;
    public isEmailSent = false;

    protected readonly emailControl = this.store.emailControl;

    private hasRedirected = false;

    constructor() {
        effect(() => {
            const session = this.store.session();
            if (!session || this.hasRedirected) {
                return;
            }
            this.hasRedirected = true;
            this.isEmailSent = true;
        });
    }

    protected onSubmit(): void {
        this.store.submit();
    }

    public onResendEmail(): void {
        this.isEmailSent = false;
    }

    public onCancel(): void {
        this.router.navigate([LOGIN_ROUTE]);
    }
}
