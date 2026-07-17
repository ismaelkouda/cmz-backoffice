import { Injectable, inject } from '@angular/core';
import { MunicipalitiesByDepartmentIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/municipalities-by-department-id-filter-props.interface';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdRepository } from '@pages/administrative-boundary/domain/repositories/departments/municipalities-by-department-id-repository';
import { municipalitiesByDepartmentIdFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/municipalities-by-department-id-filter.mapper';
import { MunicipalitiesByDepartmentIdMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/municipalities-by-department-id.mapper';
import { MunicipalitiesByDepartmentIdApi } from '@pages/administrative-boundary/infrastructure/data/sources/departments/municipalities-by-department-id.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdRepositoryImpl implements MunicipalitiesByDepartmentIdRepository {
    private readonly api = inject(MunicipalitiesByDepartmentIdApi);
    private readonly mapper = inject(MunicipalitiesByDepartmentIdMapper);

    execute(
        filter: MunicipalitiesByDepartmentIdFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        const paramsDto = municipalitiesByDepartmentIdFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
