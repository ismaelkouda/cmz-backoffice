import { Injectable, inject } from '@angular/core';
import { DepartmentsCreateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsDeleteEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsUpdateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { departmentsCreateMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-create.mapper';
import { departmentsDeleteMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-delete.mapper';
import { departmentsFilterMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-filter.mapper';
import { departmentsUpdateMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-update.mapper';
import { DepartmentsMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments.mapper';
import { DepartmentsApi } from '@pages/administrative-boundary/infrastructure/data/sources/departments/departments.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsRepositoryImpl implements DepartmentsRepository {
    private readonly api = inject(DepartmentsApi);
    private readonly mapper = inject(DepartmentsMapper);

    execute(
        entity: DepartmentsFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsEntity>> {
        const paramsDto = departmentsFilterMapper(entity);
        return this.api
            .readAll(paramsDto, page, options)
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
