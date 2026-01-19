import { RegionsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions.entity';
import { RegionsFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-filter.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { RegionsCreate } from '../../value-objects/regions/regions-create.vo';
import { RegionsUpdate } from '../../value-objects/regions/regions-update.vo';

export abstract class RegionsRepository {
    abstract readAll(
        filter: RegionsFilter | null,
        page: string
    ): Observable<Paginate<RegionsEntity>>;
    abstract create(payload: RegionsCreate): Observable<SimpleResponseDto<void>>;
    abstract update(payload: RegionsUpdate): Observable<SimpleResponseDto<void>>;
    abstract delete(code: string): Observable<SimpleResponseDto<void>>;
}
