import { Provider } from '@angular/core';
import { LoginRepositoryImpl } from '@presentation/pages/authentication/infrastructure/repositories/login/login.repository.impl';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login/login.repository';

export const provideLogin: Provider[] = [
    {
        provide: LoginRepository,
        useExisting: LoginRepositoryImpl,
    },
];
