import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { DepartmentsCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';

export abstract class DepartmentsRepository {
    abstract execute(
        entity: DepartmentsFilterEntity,
        page: string
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
