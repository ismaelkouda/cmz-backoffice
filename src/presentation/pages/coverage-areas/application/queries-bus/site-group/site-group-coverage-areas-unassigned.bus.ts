import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasUnassignedQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-coverage-areas-unassigned.query';
import { SiteGroupCoverageAreasUnassignedHandler } from '@pages/coverage-areas/application/queries-handlers/site-group/site-group-coverage-areas-unassigned.handler';
import { SiteGroupCoverageAreaSelectionEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area-selection.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasUnassignedBus {
    private readonly handler = inject(SiteGroupCoverageAreasUnassignedHandler);

    dispatch(
        query: SiteGroupCoverageAreasUnassignedQuery,
        options?: FetchOptions
    ): Observable<SiteGroupCoverageAreaSelectionEntity[]> {
        if (query instanceof SiteGroupCoverageAreasUnassignedQuery) {
            return this.handler.execute(query, options);
        }
        throw new Error('No handler found for query');
    }
}
