import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/regions/departments-by-region-id-repository';
import { DepartmentsByRegionIdFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/departments-by-region-id-filter.vo';
import { DepartmentsByRegionIdMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/departments-by-region-id.mapper';
import { DepartmentsByRegionIdApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/departments-by-region-id.api';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdRepositoryImpl
    implements DepartmentsByRegionIdRepository
{
    private readonly api = inject(DepartmentsByRegionIdApi);
    private readonly mapper = inject(DepartmentsByRegionIdMapper);

    readAll(
        filter: DepartmentsByRegionIdFilter | null,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        return this.api
            .readAll(filter?.toDto() ?? { region_code: '' }, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
