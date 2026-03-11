import { Provider } from '@angular/core';
import { AuthSessionMapper } from '@pages/authentication/data/mappers/auth-session.mapper';
import { AuthVariablesMapper } from '@pages/authentication/data/mappers/auth-variables.mapper';
import { AuthenticationRepositoryImpl } from '@pages/authentication/data/repositories/authentication.repository.impl';
import { AuthenticationApi } from '@pages/authentication/data/sources/authentication.api';
import { AuthenticationRepository } from '@pages/authentication/domain/repositories/authentication.repository';
export function provideAuthentication(): Provider[] {
    return [
        AuthenticationApi,
        AuthSessionMapper,
        AuthVariablesMapper,
        AuthenticationRepositoryImpl,
        {
            provide: AuthenticationRepository,
            useExisting: AuthenticationRepositoryImpl,
        },
    ];
}
