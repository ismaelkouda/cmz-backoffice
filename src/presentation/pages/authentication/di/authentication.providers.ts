import { Provider } from '@angular/core';
import { provideLogin } from '@presentation/pages/authentication/di/login/login.providers';
import { provideForgotPassword } from '@presentation/pages/authentication/di/forgot-password/forgot-password.providers';
import { provideResetPassword } from '@presentation/pages/authentication/di/reset-password/reset-password.providers';

export function provideAuthentication(): Provider[] {
    return [...provideLogin, ...provideForgotPassword, ...provideResetPassword];
}
