import { DepartmentsByRegionIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/departments-by-region-id-filter-props.interface';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class DepartmentsByRegionIdRepository {
    abstract execute(
        filter: DepartmentsByRegionIdFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsByRegionIdEntity>>;
}
