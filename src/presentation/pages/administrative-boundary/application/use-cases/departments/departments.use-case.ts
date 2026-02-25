import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { DepartmentsCreateDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-create.dto';
import { DepartmentsDeleteDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-delete.dto';
import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DepartmentsUpdateDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-update.dto';
import { DepartmentsCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { DepartmentsCreateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-create.vo';
import { DepartmentsDeleteVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-delete.vo';
import { DepartmentsFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-filter.vo';
import { DepartmentsUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-update.vo';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsUseCase {
    private readonly repository = inject(DepartmentsRepository);

    execute(
        dto: DepartmentsFilterDto | null,
        page: string
    ): Observable<Paginate<DepartmentsEntity>> {
        const vo = DepartmentsFilterVo.fromDto(dto);
        const entity = DepartmentsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
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
