import { Injectable, inject } from '@angular/core';
import { MunicipalitiesFindOneQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';
import { MunicipalitiesFindOneHandler } from '@pages/administrative-boundary/application/queries-handlers/municipalities/municipalities-find-one.handler';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneBus {
    private readonly filterHandler = inject(MunicipalitiesFindOneHandler);

    dispatch<T>(query: T): Observable<MunicipalitiesFindOneEntity> {
        if (query instanceof MunicipalitiesFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
