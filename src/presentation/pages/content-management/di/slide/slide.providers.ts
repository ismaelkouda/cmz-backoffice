import { Provider } from '@angular/core';
import { SlideRepository } from '@pages/content-management/domain/repositories/slide/slide-repository';
import { SlideRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/slide/slide-repository.impl';

export const slideProviders: Provider[] = [
    {
        provide: SlideRepository,
        useClass: SlideRepositoryImpl,
    },
];
