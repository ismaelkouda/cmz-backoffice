import { RegionsDeleteEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.validate-contract';
import { RegionsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.validate-contract';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class RegionsRepository {
    abstract execute(
        entity: RegionsFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>>;
    abstract create(
        contract: RegionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: RegionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: RegionsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
