import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsByRegionIdQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';
import { DepartmentsByRegionIdHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/regions/departments-by-region-id.handler';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdBus {
    constructor(private readonly filterHandler: DepartmentsByRegionIdHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        if (query instanceof DepartmentsByRegionIdQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
