import { Injectable, inject } from '@angular/core';
import { MunicipalitiesByDepartmentIdQuery } from '@pages/administrative-boundary/application/queries/departments/municipalities-by-department-id.query';
import { MunicipalitiesByDepartmentIdHandler } from '@pages/administrative-boundary/application/queries-handlers/departments/municipalities-by-department-id.handler';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdBus {
    private readonly filterHandler = inject(
        MunicipalitiesByDepartmentIdHandler
    );

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        if (query instanceof MunicipalitiesByDepartmentIdQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
