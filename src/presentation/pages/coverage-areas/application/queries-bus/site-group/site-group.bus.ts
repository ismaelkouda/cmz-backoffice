import { Injectable, inject } from '@angular/core';
import { SiteGroupQuery } from '@pages/coverage-areas/application/queries/site-group/site-group.query';
import { SiteGroupHandler } from '@pages/coverage-areas/application/queries-handlers/site-group/site-group.handler';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SiteGroupBus {
    private readonly filterHandler = inject(SiteGroupHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SiteGroupEntity>> {
        if (query instanceof SiteGroupQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
