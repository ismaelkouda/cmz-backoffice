import { Provider } from '@angular/core';
import { PasswordResetMapper } from '../data/mappers/password-reset.mapper';
import { PasswordResetRepositoryImpl } from '../data/repositories/password-reset.repository.impl';
import { PasswordResetApi } from '../data/sources/password-reset.api';
import { PasswordResetRepository } from '../domain/repositories/password-reset.repository';

export function providePasswordReset(): Provider[] {
    return [
        PasswordResetApi,
        PasswordResetMapper,
        PasswordResetRepositoryImpl,
        {
            provide: PasswordResetRepository,
            useExisting: PasswordResetRepositoryImpl,
        },
    ];
}
