import { Provider } from '@angular/core';
import { SlideFindOneRepository } from '@pages/content-management/domain/repositories/slide/slide-find-one-repository';
import { SlideFindOneRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/slide/slide-find-one-repository.impl';

export const slideFindOneProviders: Provider[] = [
    {
        provide: SlideFindOneRepository,
        useClass: SlideFindOneRepositoryImpl,
    },
];
