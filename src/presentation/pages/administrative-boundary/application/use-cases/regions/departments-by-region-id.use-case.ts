import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsByRegionIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id-filter.entity';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/departments-by-region-id-repository';
import { DepartmentsByRegionIdFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/departments-by-region-id-filter.vo';

import { DepartmentsByRegionIdFilterDto } from '../../dto/regions/departments-by-region-id-filter.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsByRegionIdUseCase {
    private readonly repository = inject(DepartmentsByRegionIdRepository);

    execute(
        dto: DepartmentsByRegionIdFilterDto | null,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        const vo = DepartmentsByRegionIdFilterVo.fromDto(dto);
        const filter = DepartmentsByRegionIdFilterEntity.fromVo(vo);
        return this.repository.execute(filter, page);
    }
}
