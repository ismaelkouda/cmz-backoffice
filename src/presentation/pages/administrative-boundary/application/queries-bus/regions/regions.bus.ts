import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { RegionsQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/regions.query';
import { RegionsHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/regions/regions.handler';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions.entity';

@Injectable({ providedIn: 'root' })
export class RegionsBus {
    constructor(private readonly filterHandler: RegionsHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<RegionsEntity>> {
        if (query instanceof RegionsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
