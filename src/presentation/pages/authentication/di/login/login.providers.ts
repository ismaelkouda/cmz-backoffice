import { Provider } from '@angular/core';
import { LoginRepositoryImpl } from '@presentation/pages/authentication/infrastructure/data/repositories/login/login.repository.impl';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login/login.repository';

export const loginProviders: Provider[] = [
    {
        provide: LoginRepository,
        useClass: LoginRepositoryImpl,
    },
];
