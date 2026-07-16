import { DepartmentsDeleteEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsFilterEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-filter.entity';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.validate-contract';
import { DepartmentsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.validate-contract';
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
        contract: DepartmentsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: DepartmentsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: DepartmentsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
