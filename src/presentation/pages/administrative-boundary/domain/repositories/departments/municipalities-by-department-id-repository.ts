import { MunicipalitiesByDepartmentIdFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id-filter.entity';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesByDepartmentIdRepository {
    abstract execute(
        filter: MunicipalitiesByDepartmentIdFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>>;
}
