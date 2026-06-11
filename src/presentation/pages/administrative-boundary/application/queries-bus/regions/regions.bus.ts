import { Injectable, inject } from '@angular/core';
import { RegionsQuery } from '@pages/administrative-boundary/application/queries/regions/regions.query';
import { RegionsHandler } from '@pages/administrative-boundary/application/queries-handlers/regions/regions.handler';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class RegionsBus {
    private readonly filterHandler = inject(RegionsHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>> {
        if (query instanceof RegionsQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
