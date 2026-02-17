import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/departments-by-region-id-filter.vo';

export abstract class DepartmentsByRegionIdRepository {
    abstract readAll(
        filter: DepartmentsByRegionIdFilter | null,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>>;
}
