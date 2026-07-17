import { Provider } from '@angular/core';
import { SiteGroupRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group.repository';
import { SiteGroupRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/site-group/site-group.repository.impl';

export const siteGroupProviders: Provider[] = [
    {
        provide: SiteGroupRepository,
        useClass: SiteGroupRepositoryImpl,
    },
];
