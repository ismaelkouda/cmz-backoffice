import { Provider } from '@angular/core';

import { HomeFindOneRepository } from '@presentation/pages/content-management/domain/repositories/home/home-find-one-repository';
import { HomeFindOneRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/home/home-find-one-repository.impl';

export const homeFindOneProviders: Provider[] = [
    {
        provide: HomeFindOneRepository,
        useClass: HomeFindOneRepositoryImpl,
    },
];
