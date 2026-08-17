import { Injectable, inject } from '@angular/core';
import { DepartmentsByRegionIdQuery } from '@pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';
import { DepartmentsByRegionIdHandler } from '@pages/administrative-boundary/application/queries-handlers/regions/departments-by-region-id.handler';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdBus {
    private readonly filterHandler = inject(DepartmentsByRegionIdHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        if (query instanceof DepartmentsByRegionIdQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
