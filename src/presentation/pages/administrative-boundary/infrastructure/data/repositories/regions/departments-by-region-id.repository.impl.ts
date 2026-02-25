import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsByRegionIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id-filter.entity';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/departments-by-region-id-repository';
import { DepartmentsByRegionIdFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/departments-by-region-id-filter.mapper';
import { DepartmentsByRegionIdMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/departments-by-region-id.mapper';
import { DepartmentsByRegionIdApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/departments-by-region-id.api';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdRepositoryImpl implements DepartmentsByRegionIdRepository {
    private readonly api = inject(DepartmentsByRegionIdApi);
    private readonly mapper = inject(DepartmentsByRegionIdMapper);

    execute(
        filter: DepartmentsByRegionIdFilterEntity,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        const paramsDto = DepartmentsByRegionIdFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
