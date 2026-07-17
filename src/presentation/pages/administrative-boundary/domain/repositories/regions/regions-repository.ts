import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsFilterProps } from '@pages/administrative-boundary/domain/interfaces/regions/regions-filter-props.interface';
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
        filter: RegionsFilterProps | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>>;
    abstract create(
        contract: RegionsCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: RegionsUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(dto: RegionsDeleteDto): Observable<SimpleResponseDto<void>>;
}
