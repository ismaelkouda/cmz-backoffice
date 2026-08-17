import { Injectable, inject } from '@angular/core';
import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-select-repository';
import { DepartmentsSelectMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-select.mapper';
import { DepartmentsSelectApi } from '@pages/administrative-boundary/infrastructure/data/sources/departments/departments-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsSelectRepositoryImpl implements DepartmentsSelectRepository {
    private readonly api = inject(DepartmentsSelectApi);
    private readonly mapper = inject(DepartmentsSelectMapper);

    execute(options?: FetchOptions): Observable<DepartmentsSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
