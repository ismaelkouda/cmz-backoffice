import { Provider } from '@angular/core';

import { SlideRepository } from '@presentation/pages/content-management/domain/repositories/slide/slide-repository';
import { SlideRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/slide/slide-repository.impl';

export const slideProviders: Provider[] = [
    {
        provide: SlideRepository,
        useClass: SlideRepositoryImpl,
    },
];
