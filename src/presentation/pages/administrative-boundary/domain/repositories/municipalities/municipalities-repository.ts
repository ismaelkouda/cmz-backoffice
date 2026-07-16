import { MunicipalitiesDeleteEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.validate-contract';
import { MunicipalitiesUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.validate-contract';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesRepository {
    abstract execute(
        entity: MunicipalitiesFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesEntity>>;
    abstract create(
        contract: MunicipalitiesCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: MunicipalitiesUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: MunicipalitiesDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
