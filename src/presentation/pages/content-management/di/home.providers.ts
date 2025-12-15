import { Provider } from '@angular/core';
import { HomeRepository } from '../core/domain/repositories/home.repository';
import { HomeRepositoryImpl } from '../infrastructure/data/repositories/home.repository.impl';

export const provideHome = (): Provider[] => [
    {
        provide: HomeRepository,
        useClass: HomeRepositoryImpl,
    },
];
