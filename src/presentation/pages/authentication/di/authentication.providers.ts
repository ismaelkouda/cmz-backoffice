import { Provider } from '@angular/core';
import { loginProviders } from '@presentation/pages/authentication/di/login/login.providers';
import { validateOtpProviders } from '@presentation/pages/authentication/di/verify-otp/validate-otp.providers';
import { forgotPasswordProviders } from '@presentation/pages/authentication/di/forgot-password/forgot-password.providers';
import { resetPasswordProviders } from '@presentation/pages/authentication/di/reset-password/reset-password.providers';
import { changePasswordProviders } from '@presentation/pages/authentication/di/change-password/change-password.providers';

export const provideAuthentication = (): Provider[] => [
    ...loginProviders,
    ...validateOtpProviders,
    ...forgotPasswordProviders,
    ...resetPasswordProviders,
    ...changePasswordProviders,
];
