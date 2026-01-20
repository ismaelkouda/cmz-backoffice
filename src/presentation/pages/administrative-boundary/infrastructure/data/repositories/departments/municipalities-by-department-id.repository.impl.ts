import { Injectable, inject } from '@angular/core';
import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/departments/municipalities-by-department-id-repository';
import { MunicipalitiesByDepartmentIdFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/municipalities-by-department-id-filter.vo';
import { MunicipalitiesByDepartmentIdMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/municipalities-by-department-id.mapper';
import { MunicipalitiesByDepartmentIdApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/municipalities-by-department-id.api';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdRepositoryImpl implements MunicipalitiesByDepartmentIdRepository {
    private readonly api = inject(MunicipalitiesByDepartmentIdApi);
    private readonly mapper = inject(MunicipalitiesByDepartmentIdMapper);

    readAll(filter: MunicipalitiesByDepartmentIdFilter | null, page: string): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        return this.api.readAll(filter?.toDto() ?? { department_code: '' }, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
