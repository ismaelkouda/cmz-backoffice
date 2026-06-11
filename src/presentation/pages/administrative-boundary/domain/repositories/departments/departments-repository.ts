import { DepartmentsCreateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsDeleteEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsUpdateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class DepartmentsRepository {
    abstract execute(
        entity: DepartmentsFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DepartmentsEntity>>;
    abstract create(
        entity: DepartmentsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: DepartmentsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: DepartmentsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
