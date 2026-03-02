import { NewsCategoriesSelectRepository } from '@presentation/pages/content-management/domain/repositories/news/news-categories-select-repository';
import { NewsCategoriesSelectRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/news/news-categories-select.repository.impl';

export const newsCategoriesSelectProviders = [
    {
        provide: NewsCategoriesSelectRepository,
        useClass: NewsCategoriesSelectRepositoryImpl,
    },
];
