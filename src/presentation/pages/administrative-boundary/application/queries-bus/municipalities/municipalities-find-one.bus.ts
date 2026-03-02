import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MunicipalitiesFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';
import { MunicipalitiesFindOneHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/municipalities/municipalities-find-one.handler';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneBus {
    constructor(private readonly filterHandler: MunicipalitiesFindOneHandler) {}

    dispatch<T>(query: T): Observable<MunicipalitiesFindOneEntity> {
        if (query instanceof MunicipalitiesFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
