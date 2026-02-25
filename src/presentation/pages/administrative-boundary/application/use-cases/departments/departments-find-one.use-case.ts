import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DepartmentsFindOneFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-find-one-filter.dto';
import { DepartmentsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { DepartmentsFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-find-one-repository';
import { DepartmentsFindOneFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFindOneUseCase {
    private readonly repository = inject(DepartmentsFindOneRepository);

    execute(
        dto: DepartmentsFindOneFilterDto
    ): Observable<DepartmentsFindOneEntity> {
        const vo = DepartmentsFindOneFilterVo.fromDto(dto);
        const filter = DepartmentsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
