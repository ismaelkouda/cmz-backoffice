import { Provider } from '@angular/core';
import { HomeFindOneRepository } from '@pages/content-management/domain/repositories/home/home-find-one-repository';
import { HomeFindOneRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/home/home-find-one-repository.impl';

export const homeFindOneProviders: Provider[] = [
    {
        provide: HomeFindOneRepository,
        useClass: HomeFindOneRepositoryImpl,
    },
];
