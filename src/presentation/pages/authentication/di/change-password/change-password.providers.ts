import { Provider } from '@angular/core';
import { ChangePasswordRepositoryImpl } from '@presentation/pages/authentication/infrastructure/data/repositories/change-password/change-password.repository.impl';
import { ChangePasswordRepository } from '@presentation/pages/authentication/domain/repositories/change-password/change-password.repository';

export const changePasswordProviders: Provider[] = [
    {
        provide: ChangePasswordRepository,
        useClass: ChangePasswordRepositoryImpl,
    },
];
