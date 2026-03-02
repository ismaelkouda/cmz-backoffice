import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { DepartmentsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { DepartmentsFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-find-one-repository';
import { departmentsFindOneFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-find-one-filter.mapper';
import { DepartmentsFindOneMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-find-one.mapper';
import { DepartmentsFindOneApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/departments-find-one.api';

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
