import { Observable } from 'rxjs';

import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-select.entity';

export abstract class DepartmentsSelectRepository {
    abstract execute(): Observable<DepartmentsSelectEntity[]>;
}
