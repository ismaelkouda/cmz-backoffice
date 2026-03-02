import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesByDepartmentIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id-filter.entity';
import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/municipalities-by-department-id-repository';
import { municipalitiesByDepartmentIdFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/municipalities-by-department-id-filter.mapper';
import { MunicipalitiesByDepartmentIdMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/municipalities-by-department-id.mapper';
import { MunicipalitiesByDepartmentIdApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/municipalities-by-department-id.api';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdRepositoryImpl implements MunicipalitiesByDepartmentIdRepository {
    private readonly api = inject(MunicipalitiesByDepartmentIdApi);
    private readonly mapper = inject(MunicipalitiesByDepartmentIdMapper);

    execute(
        entity: MunicipalitiesByDepartmentIdFilterEntity,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        const paramsDto = municipalitiesByDepartmentIdFilterMapper(entity);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
