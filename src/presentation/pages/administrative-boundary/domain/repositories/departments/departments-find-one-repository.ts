import { DepartmentsFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { Observable } from 'rxjs';

export abstract class DepartmentsFindOneRepository {
    abstract execute(
        filter: DepartmentsFindOneFilterEntity
    ): Observable<DepartmentsFindOneEntity>;
}
