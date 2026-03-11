import { Injectable, inject } from '@angular/core';
import { MunicipalitiesByDepartmentIdFilterDto } from '@pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';
import { MunicipalitiesByDepartmentIdFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id-filter.entity';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdRepository } from '@pages/administrative-boundary/domain/repositories/departments/municipalities-by-department-id-repository';
import { MunicipalitiesByDepartmentIdFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/municipalities-by-department-id-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
