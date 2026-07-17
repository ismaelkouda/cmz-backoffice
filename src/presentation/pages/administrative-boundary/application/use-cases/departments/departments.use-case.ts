import { Injectable, inject } from '@angular/core';
import { DepartmentsDeleteDto } from '@pages/administrative-boundary/application/dto/departments/departments-delete.dto';
import { DepartmentsFilterDto } from '@pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { departmentsDeleteVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-delete.vo';
import { departmentsFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-filter.vo';
import { departmentsCreateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-create.vo';
import { departmentsUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-update.vo';
import { DepartmentsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.contract';
import { DepartmentsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.contract';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, defer } from 'rxjs';

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
        return defer(() =>
            this.repository.execute(departmentsFilterVo(dto), page, options)
        );
    }

    create(
        createDto: DepartmentsCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.create(departmentsCreateVo(createDto))
        );
    }

    update(
        updateDto: DepartmentsUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.update(departmentsUpdateVo(updateDto))
        );
    }

    delete(
        deleteDto: DepartmentsDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.delete(departmentsDeleteVo(deleteDto))
        );
    }
}
