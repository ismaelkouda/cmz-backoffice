import { RegionsFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one-filter.entity';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class RegionsFindOneRepository {
    abstract execute(
        filter: RegionsFindOneFilterEntity | null,
        options?: FetchOptions
    ): Observable<RegionsFindOneEntity>;
}
