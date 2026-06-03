import { Provider } from '@angular/core';
import { ForgotPasswordRepositoryImpl } from '@pages/authentication/infrastructure/repositories/forgot-password/forgot-password.repository.impl';
import { ForgotPasswordRepository } from '@presentation/pages/authentication/domain/repositories/forgot-password/forgot-password.repository';

export const provideForgotPassword: Provider[] = [
    {
        provide: ForgotPasswordRepository,
        useExisting: ForgotPasswordRepositoryImpl,
    },
];
