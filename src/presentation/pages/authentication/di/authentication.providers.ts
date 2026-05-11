import { Provider } from '@angular/core';
import { AuthenticationRepositoryImpl } from '@pages/authentication/data/repositories/authentication.repository.impl';
import { AuthenticationRepository } from '@pages/authentication/domain/repositories/authentication.repository';

export function provideAuthentication(): Provider[] {
    return [
        {
            provide: AuthenticationRepository,
            useExisting: AuthenticationRepositoryImpl,
        },
    ];
}
