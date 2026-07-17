import { MunicipalitiesByDepartmentIdFilterProps } from '@pages/administrative-boundary/domain/interfaces/departments/municipalities-by-department-id-filter-props.interface';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesByDepartmentIdRepository {
    abstract execute(
        filter: MunicipalitiesByDepartmentIdFilterProps,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>>;
}
