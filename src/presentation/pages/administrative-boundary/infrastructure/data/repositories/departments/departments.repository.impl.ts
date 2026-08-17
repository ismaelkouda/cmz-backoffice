import { Injectable, inject } from '@angular/core';
import { DepartmentsDeleteDto } from '@pages/administrative-boundary/application/dto/departments/departments-delete.dto';
import { DepartmentsFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/departments-filter-props.interface';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.validate-contract';
import { DepartmentsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.validate-contract';
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
        filter: DepartmentsFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsEntity>> {
        const paramsDto = departmentsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        contract: DepartmentsCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsCreateMapper(contract);
        return this.api.create(paramsDto);
    }

    update(
        contract: DepartmentsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsUpdateMapper(contract);
        return this.api.update(paramsDto);
    }

    delete(dto: DepartmentsDeleteDto): Observable<SimpleResponseDto<void>> {
        const paramsDto = departmentsDeleteMapper(dto);
        return this.api.delete(paramsDto);
    }
}
