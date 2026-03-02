import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { DepartmentsCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { departmentsCreateMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-create.mapper';
import { departmentsDeleteMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-delete.mapper';
import { departmentsFilterMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-filter.mapper';
import { departmentsUpdateMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-update.mapper';
import { DepartmentsMapper } from '@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments.mapper';
import { DepartmentsApi } from '@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/departments.api';

@Injectable({ providedIn: 'root' })
export class DepartmentsRepositoryImpl implements DepartmentsRepository {
    private readonly api = inject(DepartmentsApi);
    private readonly mapper = inject(DepartmentsMapper);

    execute(
        entity: DepartmentsFilterEntity,
        page: string
    ): Observable<Paginate<DepartmentsEntity>> {
        const paramsDto = departmentsFilterMapper(entity);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        entity: DepartmentsCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsCreateMapper(entity);
        return this.api.create(paramsDto);
    }

    update(
        entity: DepartmentsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsUpdateMapper(entity);
        return this.api.update(paramsDto);
    }

    delete(
        entity: DepartmentsDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsDeleteMapper(entity);
        return this.api.delete(paramsDto);
    }
}
