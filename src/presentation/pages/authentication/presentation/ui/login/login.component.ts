import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { LoginStore } from '@presentation/pages/authentication/presentation/store/login/login.store';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { DASHBOARD } from '@shared/routes/routes';
import { REINITIALIZATION } from '@presentation/app.routes';
import { FORGOT_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/constants/forgot-password/forgot-password-routes.constant';
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
    imports: [ReactiveFormsModule, PasswordModule, TranslateModule, RouterLink],
    providers: [LoginStore],
})
export class LoginComponent {
    protected readonly store = (() => {
        console.log('inject LoginStore');
        return inject(LoginStore);
    })();

    protected readonly appConfig = (() => {
        console.log('inject AppCustomizationService');
        return inject(AppCustomizationService);
    })();

    private readonly encodingDataService = (() => {
        console.log('inject EncodingDataService');
        return inject(EncodingDataService);
    })();

    private readonly router = (() => {
        console.log('inject Router');
        return inject(Router);
    })();

    protected readonly KEYS = LOGIN_FORM_KEYS;
    protected readonly REINITIALIZATION = REINITIALIZATION;
    protected readonly FORGOT_PASSWORD_ROUTE = FORGOT_PASSWORD_ROUTE;
    protected readonly AUTH_LOGO = this.appConfig.customization.assets.authLogo;
    protected readonly APP_NAME = this.appConfig.customization.app.name;

    private hasRedirected = false;

    constructor() {
        console.log('LOGIN COMPONENT CREATED');
        effect(() => {
            const error = this.store.error();
            if (error) {
                this.store.resetPassword();
            }
        });
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
