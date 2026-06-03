import { Provider } from '@angular/core';
import { LoginRepositoryImpl } from '@pages/authentication/infrastructure/repositories/login.repository.impl';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login.repository';

export function provideAuthentication(): Provider[] {
    return [
        {
            provide: LoginRepository,
            useExisting: LoginRepositoryImpl,
        },
    ];
}
