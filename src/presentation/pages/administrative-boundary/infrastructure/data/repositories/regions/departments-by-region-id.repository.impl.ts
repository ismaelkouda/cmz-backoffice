import { Injectable, inject } from '@angular/core';
import { DepartmentsByRegionIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/departments-by-region-id-filter-props.interface';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdRepository } from '@pages/administrative-boundary/domain/repositories/regions/departments-by-region-id-repository';
import { DepartmentsByRegionIdFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/departments-by-region-id-filter.mapper';
import { DepartmentsByRegionIdMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/departments-by-region-id.mapper';
import { DepartmentsByRegionIdApi } from '@pages/administrative-boundary/infrastructure/data/sources/regions/departments-by-region-id.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdRepositoryImpl implements DepartmentsByRegionIdRepository {
    private readonly api = inject(DepartmentsByRegionIdApi);
    private readonly mapper = inject(DepartmentsByRegionIdMapper);

    execute(
        filter: DepartmentsByRegionIdFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        const paramsDto = DepartmentsByRegionIdFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
