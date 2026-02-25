import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsByRegionIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id-filter.entity';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';

export abstract class DepartmentsByRegionIdRepository {
    abstract execute(
        filter: DepartmentsByRegionIdFilterEntity,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>>;
}
