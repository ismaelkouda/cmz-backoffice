import { Observable } from 'rxjs';
import { DepartmentsFindoneEntity } from '../../entities/departments/departments-findone.entity';
import { DepartmentsFindoneFilter } from '../../value-objects/departments/departments-findone-filter.vo';

export abstract class DepartmentsFindoneRepository {
    abstract read(
        filter: DepartmentsFindoneFilter | null,
    ): Observable<DepartmentsFindoneEntity>;
}
