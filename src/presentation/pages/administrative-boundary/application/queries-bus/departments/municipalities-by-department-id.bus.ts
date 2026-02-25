import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesByDepartmentIdQuery } from '@presentation/pages/administrative-boundary/application/queries/departments/municipalities-by-department-id.query';
import { MunicipalitiesByDepartmentIdHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/departments/municipalities-by-department-id.handler';
import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdBus {
    constructor(
        private readonly filterHandler: MunicipalitiesByDepartmentIdHandler
    ) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        if (query instanceof MunicipalitiesByDepartmentIdQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
