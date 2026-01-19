import { Injectable, inject } from '@angular/core';
import { DepartmentsFindoneFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-findone-filter.vo';
import { Observable, map } from 'rxjs';
import { DepartmentsFindoneEntity } from '../../../../core/domain/entities/departments/departments-findone.entity';
import { DepartmentsFindoneRepository } from '../../../../core/domain/repositories/departments/departments-findone-repository';
import { DepartmentsFindoneMapper } from '../../mappers/departments/departments-findone.mapper';
import { DepartmentsFindoneApi } from '../../sources/departments/departments-findone.api';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindoneRepositoryImpl implements DepartmentsFindoneRepository {
    private readonly api = inject(DepartmentsFindoneApi);
    private readonly mapper = inject(DepartmentsFindoneMapper);

    read(filter: DepartmentsFindoneFilter | null): Observable<DepartmentsFindoneEntity> {
        return this.api
            .read(filter?.toDto() || {})
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
