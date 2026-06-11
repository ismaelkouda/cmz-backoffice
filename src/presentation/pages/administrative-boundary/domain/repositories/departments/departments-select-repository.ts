import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class DepartmentsSelectRepository {
    abstract execute(
        options?: FetchOptions
    ): Observable<DepartmentsSelectEntity[]>;
}
