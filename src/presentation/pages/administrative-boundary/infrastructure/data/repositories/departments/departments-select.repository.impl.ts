import { Injectable, inject } from '@angular/core';
import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-select-repository';
import { DepartmentsSelectMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-select.mapper';
import { DepartmentsSelectApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/departments-select.api';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsSelectRepositoryImpl implements DepartmentsSelectRepository {
    private readonly api = inject(DepartmentsSelectApi);
    private readonly mapper = inject(DepartmentsSelectMapper);

    readAll(): Observable<Array<DepartmentsSelectEntity>> {
        return this.api
            .readAll()
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
