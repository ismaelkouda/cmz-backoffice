import { Provider } from '@angular/core';
import { loginProviders } from '@presentation/pages/authentication/di/login/login.providers';
import { forgotPasswordProviders } from '@presentation/pages/authentication/di/forgot-password/forgot-password.providers';
import { resetPasswordProviders } from '@presentation/pages/authentication/di/reset-password/reset-password.providers';

export const provideAuthentication = (): Provider[] => [
    ...loginProviders,
    ...forgotPasswordProviders,
    ...resetPasswordProviders,
];
