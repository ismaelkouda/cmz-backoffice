import { Provider } from '@angular/core';
import { SlideRepository } from '../core/domain/repositories/slide.repository';
import { SlideRepositoryImpl } from '../infrastructure/data/repositories/slide.repository.impl';

export const provideSlide = (): Provider[] => [
    {
        provide: SlideRepository,
        useClass: SlideRepositoryImpl,
    },
];
