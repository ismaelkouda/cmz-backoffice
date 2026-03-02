import { Observable } from 'rxjs';

import { DepartmentsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';

export abstract class DepartmentsFindOneRepository {
    abstract execute(
        filter: DepartmentsFindOneFilterEntity
    ): Observable<DepartmentsFindOneEntity>;
}
