import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-paths.constants';
import { AUTH } from '@presentation/app.routes';

@Component({
    selector: 'app-reset-password-success',
    standalone: true,
    templateUrl: './reset-password-success.component.html',
    styleUrls: ['./reset-password-success.component.scss'],
    imports: [TranslateModule, RouterLink],
})
export class ResetPasswordSuccessComponent {
    private readonly router = inject(Router);
    private readonly appConfig = inject(AppCustomizationService);

    protected readonly AUTH = AUTH;
    protected readonly LOGIN_ROUTE = LOGIN_ROUTE;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected goToLogin(): void {
        this.router.navigate(['/', AUTH, LOGIN_ROUTE]);
    }
}
