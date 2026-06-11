import { DepartmentsFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class DepartmentsFindOneRepository {
    abstract execute(
        filter: DepartmentsFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<DepartmentsFindOneEntity>;
}
