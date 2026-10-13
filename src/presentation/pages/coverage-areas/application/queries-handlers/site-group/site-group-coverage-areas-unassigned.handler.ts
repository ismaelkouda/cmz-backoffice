import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasUnassignedQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-coverage-areas-unassigned.query';
import { SiteGroupCoverageAreasUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-coverage-areas.use-case';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasUnassignedHandler {
    private readonly useCase = inject(SiteGroupCoverageAreasUseCase);

    execute(
        _query: SiteGroupCoverageAreasUnassignedQuery,
        options?: FetchOptions
    ) {
        return this.useCase.readUnassigned(options);
    }
}
