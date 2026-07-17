import { Injectable, inject } from '@angular/core';
import { SiteGroupFindOneQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-find-one.query';
import { SiteGroupFindOneHandler } from '@pages/coverage-areas/application/queries-handlers/site-group/site-group-find-one.handler';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SiteGroupFindOneBus {
    private readonly filterHandler = inject(SiteGroupFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<SiteGroupFindOneEntity> {
        if (query instanceof SiteGroupFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
