import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-coverage-areas.query';
import { SiteGroupCoverageAreasUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-coverage-areas.use-case';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasHandler {
    private readonly useCase = inject(SiteGroupCoverageAreasUseCase);

    execute(query: SiteGroupCoverageAreasQuery, options?: FetchOptions) {
        return this.useCase.read(query.siteGroupId, options);
    }
}
