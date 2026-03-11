import { DepartmentsByRegionIdFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id-filter.entity';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class DepartmentsByRegionIdRepository {
    abstract execute(
        filter: DepartmentsByRegionIdFilterEntity,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>>;
}
