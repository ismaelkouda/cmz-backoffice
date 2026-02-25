import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MunicipalitiesByDepartmentIdFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id-filter.entity';
import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';

export abstract class MunicipalitiesByDepartmentIdRepository {
    abstract execute(
        filter: MunicipalitiesByDepartmentIdFilterEntity,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>>;
}
