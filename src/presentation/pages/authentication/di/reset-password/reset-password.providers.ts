import { Provider } from '@angular/core';
import { ResetPasswordRepositoryImpl } from '@presentation/pages/authentication/infrastructure/data/repositories/reset-password/reset-password.repository.impl';
import { ResetPasswordRepository } from '@presentation/pages/authentication/domain/repositories/reset-password/reset-password.repository';

export const resetPasswordProviders: Provider[] = [
    {
        provide: ResetPasswordRepository,
        useClass: ResetPasswordRepositoryImpl,
    },
];
