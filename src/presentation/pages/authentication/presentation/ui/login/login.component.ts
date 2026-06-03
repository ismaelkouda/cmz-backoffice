import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FORGOT_PASSWORD } from '@pages/password-reset/password-reset.routes';
import { REINITIALIZATION } from '@presentation/app.routes';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { DASHBOARD } from '@shared/routes/routes';
import { PasswordModule } from 'primeng/password';
import { LoginStore } from '@presentation/pages/authentication/presentation/store/login.store';
import { set } from 'ol/transform';

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
    public readonly appConfig = inject(AppCustomizationService).customization;
    private readonly encodingDataService = inject(EncodingDataService);
    private readonly router = inject(Router);
    public readonly REINITIALIZATION = REINITIALIZATION;
    public readonly FORGOT_PASSWORD = FORGOT_PASSWORD;
    public readonly AUTH_LOGO = this.appConfig.assets.authLogo;
    public readonly form = this.store.form;

    constructor() {
        effect(() => {
            const session = this.store.session();
            console.log('session: ', session);

            if (!session) {
                return;
            }
            console.log('NAVIGATE DASHBOARD');
            this.storeUserAndToken(session.user, session.token);

            setTimeout(() => {
                this.router.navigate(['']);
            }, 5000);
        });
    }

    onSubmit(): void {
        this.store.submit();
    }

    isFieldInvalid(field: 'email' | 'password'): boolean {
        return this.store.isFieldInvalid(field);
    }

    isFieldValid(field: 'email' | 'password'): boolean {
        return this.store.isFieldValid(field);
    }
    isFieldTouched(field: 'email' | 'password'): boolean {
        return this.store.isFieldTouched(field);
    }
    getFieldError(field: 'email' | 'password'): string | null {
        return this.store.getFieldError(field);
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
