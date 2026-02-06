import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { DepartmentsCreate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-create.vo';
import { DepartmentsFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-filter.vo';
import { DepartmentsUpdate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-update.vo';

import { DepartmentsEntity } from '../../../../core/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '../../../../core/domain/repositories/departments/departments-repository';
import { departmentsCreateMapper } from '../../mappers/departments/departments-create-mapper';
import { departmentsFilterMapper } from '../../mappers/departments/departments-filter-mapper';
import { departmentsUpdateMapper } from '../../mappers/departments/departments-update-mapper';
import { DepartmentsMapper } from '../../mappers/departments/departments.mapper';
import { DepartmentsApi } from '../../sources/departments/departments.api';

@Injectable({ providedIn: 'root' })
export class DepartmentsRepositoryImpl implements DepartmentsRepository {
    private readonly api = inject(DepartmentsApi);
    private readonly mapper = inject(DepartmentsMapper);

    readAll(
        filter: DepartmentsFilter,
        page: string
    ): Observable<Paginate<DepartmentsEntity>> {
        const paramsDto = departmentsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: DepartmentsCreate): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsCreateMapper(payload);
        return this.api.create(paramsDto);
    }

    update(payload: DepartmentsUpdate): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsUpdateMapper(payload);
        return this.api.update(paramsDto);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }
}
