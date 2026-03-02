import { Observable } from 'rxjs';

import { RegionsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one-filter.entity';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';

export abstract class RegionsFindOneRepository {
    abstract execute(
        filter: RegionsFindOneFilterEntity | null
    ): Observable<RegionsFindOneEntity>;
}
