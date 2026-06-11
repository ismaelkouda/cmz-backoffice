import { Injectable, inject } from '@angular/core';
import { DepartmentsFindOneFilterDto } from '@pages/administrative-boundary/application/dto/departments/departments-find-one-filter.dto';
import { DepartmentsFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { DepartmentsFindOneRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-find-one-repository';
import { DepartmentsFindOneFilterVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFindOneUseCase {
    private readonly repository = inject(DepartmentsFindOneRepository);

    execute(
        dto: DepartmentsFindOneFilterDto,
        options?: FetchOptions
    ): Observable<DepartmentsFindOneEntity> {
        const vo = DepartmentsFindOneFilterVo.fromDto(dto);
        const filter = DepartmentsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
