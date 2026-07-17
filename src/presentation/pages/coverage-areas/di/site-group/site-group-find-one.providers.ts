import { Provider } from '@angular/core';
import { SiteGroupFindOneUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-find-one.use-case';
import { SiteGroupFindOneRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-find-one.repository';
import { SiteGroupFindOneMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-find-one.mapper';
import { SiteGroupFindOneRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/site-group/site-group-find-one.repository.impl';
import { SiteGroupFindOneApi } from '@pages/coverage-areas/infrastructure/data/sources/site-group/site-group-find-one.api';

export const siteGroupFindOneProviders: Provider[] = [
    SiteGroupFindOneApi,
    SiteGroupFindOneMapper,
    SiteGroupFindOneUseCase,
    {
        provide: SiteGroupFindOneRepository,
        useClass: SiteGroupFindOneRepositoryImpl,
    },
];
