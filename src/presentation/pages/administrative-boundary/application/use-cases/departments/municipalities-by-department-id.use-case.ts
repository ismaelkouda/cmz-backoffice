import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesByDepartmentIdFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';
import { MunicipalitiesByDepartmentIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id-filter.entity';
import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/municipalities-by-department-id-repository';
import { MunicipalitiesByDepartmentIdFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/municipalities-by-department-id-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesByDepartmentIdUseCase {
    private readonly repository = inject(
        MunicipalitiesByDepartmentIdRepository
    );

    execute(
        filterDto: MunicipalitiesByDepartmentIdFilterDto,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        const vo = MunicipalitiesByDepartmentIdFilterVo.fromDto(filterDto);
        const filter = MunicipalitiesByDepartmentIdFilterEntity.fromVo(vo);
        return this.repository.execute(filter, page);
    }
}
