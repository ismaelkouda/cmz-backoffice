import { RegionsCreateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsDeleteEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsUpdateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
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
        entity: RegionsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: RegionsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: RegionsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
