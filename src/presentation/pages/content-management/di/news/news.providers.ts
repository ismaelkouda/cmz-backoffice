import { Provider } from '@angular/core';
import { NewsRepository } from '@pages/content-management/domain/repositories/news/news-repository';
import { NewsRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/news/news-repository.impl';

export const newsProviders: Provider[] = [
    {
        provide: NewsRepository,
        useClass: NewsRepositoryImpl,
    },
];
