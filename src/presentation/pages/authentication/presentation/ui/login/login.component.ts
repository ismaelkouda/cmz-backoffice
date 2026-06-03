import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { LoginStore } from '@presentation/pages/authentication/presentation/store/login.store';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { DASHBOARD } from '@shared/routes/routes';
import { REINITIALIZATION } from '@presentation/app.routes';
import { FORGOT_PASSWORD } from '@pages/password-reset/password-reset.routes';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule, PasswordModule, TranslateModule, RouterLink],
    providers: [LoginStore],
})
export class LoginComponent {
    protected readonly store = inject(LoginStore);
    protected readonly appConfig = inject(AppCustomizationService);
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly router = inject(Router);

    protected readonly REINITIALIZATION = REINITIALIZATION;
    protected readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    protected readonly emailControl = this.store.emailControl;
    protected readonly passwordControl = this.store.passwordControl;

    private hasRedirected = false;

    constructor() {
        effect(() => {
            const session = this.store.session();
            if (!session || this.hasRedirected) {
                return;
            }

            this.hasRedirected = true;
            this.storeUserAndToken(session.user, session.token);
            void this.router.navigate([DASHBOARD]);
        });
    }

    protected onSubmit(): void {
        this.store.submit();
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
