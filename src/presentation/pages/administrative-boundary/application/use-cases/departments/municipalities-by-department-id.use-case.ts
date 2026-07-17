import { Injectable, inject } from '@angular/core';
import { MunicipalitiesByDepartmentIdFilterDto } from '@pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdRepository } from '@pages/administrative-boundary/domain/repositories/departments/municipalities-by-department-id-repository';
import { municipalitiesByDepartmentIdFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/municipalities-by-department-id-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesByDepartmentIdUseCase {
    private readonly repository = inject(
        MunicipalitiesByDepartmentIdRepository
    );

    execute(
        filterDto: MunicipalitiesByDepartmentIdFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        return defer(() =>
            this.repository.execute(
                municipalitiesByDepartmentIdFilterVo(filterDto),
                page,
                options
            )
        );
    }
}
