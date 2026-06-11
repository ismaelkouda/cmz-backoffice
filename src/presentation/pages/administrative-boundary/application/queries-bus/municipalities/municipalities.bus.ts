import { Injectable, inject } from '@angular/core';
import { MunicipalitiesQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities.query';
import { MunicipalitiesHandler } from '@pages/administrative-boundary/application/queries-handlers/municipalities/municipalities.handler';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesBus {
    private readonly filterHandler = inject(MunicipalitiesHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesEntity>> {
        if (query instanceof MunicipalitiesQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
