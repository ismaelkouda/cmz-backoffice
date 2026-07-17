import { Provider } from '@angular/core';
import { ForgotPasswordRepositoryImpl } from '@presentation/pages/authentication/infrastructure/data/repositories/forgot-password/forgot-password.repository.impl';
import { ForgotPasswordRepository } from '@presentation/pages/authentication/domain/repositories/forgot-password/forgot-password.repository';

export const forgotPasswordProviders: Provider[] = [
    {
        provide: ForgotPasswordRepository,
        useClass: ForgotPasswordRepositoryImpl,
    },
];
