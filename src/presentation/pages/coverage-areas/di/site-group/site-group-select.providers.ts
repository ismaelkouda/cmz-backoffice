import { Provider } from '@angular/core';
import { SiteGroupSelectRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-select.repository';
import { SiteGroupSelectRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/site-group/site-group-select.repository.impl';

export const siteGroupSelectProviders: Provider[] = [
    {
        provide: SiteGroupSelectRepository,
        useClass: SiteGroupSelectRepositoryImpl,
    },
];
