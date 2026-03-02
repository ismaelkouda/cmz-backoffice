import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesQuery } from '@presentation/pages/administrative-boundary/application/queries/municipalities/municipalities.query';
import { MunicipalitiesHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/municipalities/municipalities.handler';
import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesBus {
    constructor(private readonly filterHandler: MunicipalitiesHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>> {
        if (query instanceof MunicipalitiesQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
