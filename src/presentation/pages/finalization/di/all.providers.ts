import { Provider } from '@angular/core';
import { AllRepositoryImpl } from '../data/repositories/all.repository.impl';
import { AllRepository } from '../domain/repositories/all.repository';

export const provideAll = (): Provider[] => [
    {
        provide: AllRepository,
        useClass: AllRepositoryImpl,
    },
];
