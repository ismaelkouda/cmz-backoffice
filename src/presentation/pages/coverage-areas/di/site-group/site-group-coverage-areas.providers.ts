import { Provider } from '@angular/core';
import { SiteGroupCoverageAreasRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-coverage-areas.repository';
import { SiteGroupCoverageAreasRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/site-group/site-group-coverage-areas.repository.impl';

export const siteGroupCoverageAreasProviders: Provider[] = [
    {
        provide: SiteGroupCoverageAreasRepository,
        useClass: SiteGroupCoverageAreasRepositoryImpl,
    },
];
