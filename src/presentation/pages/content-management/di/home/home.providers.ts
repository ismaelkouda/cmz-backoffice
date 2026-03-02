import { Provider } from '@angular/core';

import { HomeRepository } from '@presentation/pages/content-management/domain/repositories/home/home-repository';
import { HomeRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/home/home-repository.impl';

export const homeProviders: Provider[] = [
    {
        provide: HomeRepository,
        useClass: HomeRepositoryImpl,
    },
];
