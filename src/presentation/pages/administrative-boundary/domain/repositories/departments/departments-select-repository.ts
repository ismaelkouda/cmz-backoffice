import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { Observable } from 'rxjs';

export abstract class DepartmentsSelectRepository {
    abstract execute(): Observable<DepartmentsSelectEntity[]>;
}
