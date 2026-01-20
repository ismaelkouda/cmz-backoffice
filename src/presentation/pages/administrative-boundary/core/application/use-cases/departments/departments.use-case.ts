import { Injectable, inject } from '@angular/core';
import { DepartmentsCreateDto } from '@presentation/pages/administrative-boundary/core/application/dtos/departments/departments-create.dto';
import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/core/application/dtos/departments/departments-filter.dto';
import { DepartmentsUpdateDto } from '@presentation/pages/administrative-boundary/core/application/dtos/departments/departments-update.dto';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-repository';
import { DepartmentsFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-filter.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { DepartmentsCreate } from '../../../domain/value-objects/departments/departments-create.vo';
import { DepartmentsUpdate } from '../../../domain/value-objects/departments/departments-update.vo';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsUseCase {
    private readonly repository = inject(DepartmentsRepository);

    readAll(
        filterDto: DepartmentsFilterDto | null,
        page: string
    ): Observable<Paginate<DepartmentsEntity>> {
        const filter = DepartmentsFilter.create(filterDto);
        return this.repository.readAll(filter, page);
    }

    create(createDto: DepartmentsCreateDto): Observable<SimpleResponseDto<void>> {
        const create = DepartmentsCreate.create(createDto);
        return this.repository.create(create);
    }

    update(updateDto: DepartmentsUpdateDto): Observable<SimpleResponseDto<void>> {
        const update = DepartmentsUpdate.create(updateDto);
        return this.repository.update(update);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(code);
    }
}
