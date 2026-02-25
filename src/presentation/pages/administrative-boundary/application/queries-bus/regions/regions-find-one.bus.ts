import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RegionsFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/regions-find-one.query';
import { RegionsFindOneHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/regions/regions-find-one.handler';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneBus {
    constructor(private readonly filterHandler: RegionsFindOneHandler) {}

    dispatch<T>(query: T): Observable<RegionsFindOneEntity> {
        if (query instanceof RegionsFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
