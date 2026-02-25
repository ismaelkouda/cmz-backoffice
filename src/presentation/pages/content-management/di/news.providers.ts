import { Provider } from '@angular/core';

import { NewsRepository } from '../domain/repositories/news.repository';
import { NewsRepositoryImpl } from '../infrastructure/data/repositories/news.repository.impl';

export const provideNews = (): Provider[] => [
    {
        provide: NewsRepository,
        useClass: NewsRepositoryImpl,
    },
];
