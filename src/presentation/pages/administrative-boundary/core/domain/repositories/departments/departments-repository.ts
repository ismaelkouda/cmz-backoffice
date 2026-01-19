import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { DepartmentsEntity } from '../../entities/departments/departments.entity';

import { DepartmentsCreate } from '../../value-objects/departments/departments-create.vo';
import { DepartmentsFilter } from '../../value-objects/departments/departments-filter.vo';
import { DepartmentsUpdate } from '../../value-objects/departments/departments-update.vo';

export abstract class DepartmentsRepository {
    abstract readAll(
        filter: DepartmentsFilter | null,
        page: string
    ): Observable<Paginate<DepartmentsEntity>>;
    abstract create(payload: DepartmentsCreate): Observable<SimpleResponseDto<void>>;
    abstract update(payload: DepartmentsUpdate): Observable<SimpleResponseDto<void>>;
    abstract delete(code: string): Observable<SimpleResponseDto<void>>;
}
