import { Injectable, inject } from '@angular/core';
import { DepartmentsByRegionIdFilterDto } from '@pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { DepartmentsByRegionIdFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id-filter.entity';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdRepository } from '@pages/administrative-boundary/domain/repositories/regions/departments-by-region-id-repository';
import { DepartmentsByRegionIdFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/departments-by-region-id-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsByRegionIdUseCase {
    private readonly repository = inject(DepartmentsByRegionIdRepository);

    execute(
        dto: DepartmentsByRegionIdFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        const vo = DepartmentsByRegionIdFilterVo.fromDto(dto);
        const filter = DepartmentsByRegionIdFilterEntity.fromVo(vo);
        return this.repository.execute(filter, page, options);
    }
}
