import { Provider } from '@angular/core';
import { ResetPasswordRepositoryImpl } from '@pages/authentication/infrastructure/repositories/reset-password/reset-password.repository.impl';
import { ResetPasswordRepository } from '@presentation/pages/authentication/domain/repositories/reset-password/reset-password.repository';

export const provideResetPassword: Provider[] = [
    {
        provide: ResetPasswordRepository,
        useExisting: ResetPasswordRepositoryImpl,
    },
];
