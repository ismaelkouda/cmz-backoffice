import { Injectable, inject } from '@angular/core';
import { DepartmentsFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { DepartmentsFindOneRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-find-one-repository';
import { departmentsFindOneFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-find-one-filter.mapper';
import { DepartmentsFindOneMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-find-one.mapper';
import { DepartmentsFindOneApi } from '@pages/administrative-boundary/infrastructure/data/sources/departments/departments-find-one.api';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneRepositoryImpl implements DepartmentsFindOneRepository {
    private readonly api = inject(DepartmentsFindOneApi);
    private readonly mapper = inject(DepartmentsFindOneMapper);

    execute(
        filter: DepartmentsFindOneFilterEntity
    ): Observable<DepartmentsFindOneEntity> {
        const paramsDto = departmentsFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
