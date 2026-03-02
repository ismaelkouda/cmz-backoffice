import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { RegionsCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions.entity';

export abstract class RegionsRepository {
    abstract execute(
        entity: RegionsFilterEntity | null,
        page: string
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
