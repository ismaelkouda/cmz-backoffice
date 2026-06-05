import { Provider } from '@angular/core';
import { PasswordChangeRepository } from '../domain/repositories/password-change.repository';
import { PasswordChangeRepositoryImpl } from '../infrastructure/data/repositories/password-change.repository.impl';

export const providePasswordChange: Provider[] = [
    {
        provide: PasswordChangeRepository,
        useClass: PasswordChangeRepositoryImpl,
    },
];
