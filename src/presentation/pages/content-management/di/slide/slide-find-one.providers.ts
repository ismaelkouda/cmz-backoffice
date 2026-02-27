import { Provider } from '@angular/core';

import { SlideFindOneRepository } from '@presentation/pages/content-management/domain/repositories/slide/slide-find-one-repository';
import { SlideFindOneRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/slide/slide-find-one-repository.impl';

export const slideFindOneProviders: Provider[] = [
    {
        provide: SlideFindOneRepository,
        useClass: SlideFindOneRepositoryImpl,
    },
];
