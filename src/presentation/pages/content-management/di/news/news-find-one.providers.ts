import { Provider } from '@angular/core';
import { NewsFindOneRepository } from '@pages/content-management/domain/repositories/news/news-find-one-repository';
import { NewsFindOneRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/news/news-find-one-repository.impl';

export const newsFindOneProviders: Provider[] = [
    {
        provide: NewsFindOneRepository,
        useClass: NewsFindOneRepositoryImpl,
    },
];
