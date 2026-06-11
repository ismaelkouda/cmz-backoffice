import { Injectable, inject } from '@angular/core';
import { DepartmentsCreateDto } from '@pages/administrative-boundary/application/dto/departments/departments-create.dto';
import { DepartmentsDeleteDto } from '@pages/administrative-boundary/application/dto/departments/departments-delete.dto';
import { DepartmentsFilterDto } from '@pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DepartmentsUpdateDto } from '@pages/administrative-boundary/application/dto/departments/departments-update.dto';
import { DepartmentsCreateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsDeleteEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsUpdateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { DepartmentsCreateVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-create.vo';
import { DepartmentsDeleteVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-delete.vo';
import { DepartmentsFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-filter.vo';
import { DepartmentsUpdateVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsUseCase {
    private readonly repository = inject(DepartmentsRepository);

    execute(
        dto: DepartmentsFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsEntity>> {
        const vo = DepartmentsFilterVo.fromDto(dto);
        const entity = DepartmentsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }

    create(
        createDto: DepartmentsCreateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = DepartmentsCreateVo.fromDto(createDto);
        const entity = DepartmentsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(
        updateDto: DepartmentsUpdateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = DepartmentsUpdateVo.fromDto(updateDto);
        const entity = DepartmentsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(
        deleteDto: DepartmentsDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = DepartmentsDeleteVo.fromDto(deleteDto);
        const entity = DepartmentsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
