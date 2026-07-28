import { Provider } from '@angular/core';
import { SiteGroupFindOneRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-find-one.repository';
import { SiteGroupFindOneRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/site-group/site-group-find-one.repository.impl';

export const siteGroupFindOneProviders: Provider[] = [
    {
        provide: SiteGroupFindOneRepository,
        useClass: SiteGroupFindOneRepositoryImpl,
    },
];
