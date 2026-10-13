import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-coverage-areas.query';
import { SiteGroupCoverageAreasHandler } from '@pages/coverage-areas/application/queries-handlers/site-group/site-group-coverage-areas.handler';
import { SiteGroupCoverageAreasEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-areas.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasBus {
    private readonly handler = inject(SiteGroupCoverageAreasHandler);

    dispatch(
        query: SiteGroupCoverageAreasQuery,
        options?: FetchOptions
    ): Observable<SiteGroupCoverageAreasEntity> {
        if (query instanceof SiteGroupCoverageAreasQuery) {
            return this.handler.execute(query, options);
        }
        throw new Error('No handler found for query');
    }
}
