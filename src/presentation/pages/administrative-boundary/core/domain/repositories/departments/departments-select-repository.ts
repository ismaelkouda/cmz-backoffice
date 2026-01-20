import { Observable } from 'rxjs';
import { DepartmentsSelectEntity } from '../../entities/departments/departments-select.entity';

export abstract class DepartmentsSelectRepository {
    abstract readAll(): Observable<Array<DepartmentsSelectEntity>>;
}
