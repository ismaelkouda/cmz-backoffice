import { Observable } from 'rxjs';
import { RegionsFindoneEntity } from '../../entities/regions/regions-findone.entity';
import { RegionsFindoneFilter } from '../../value-objects/regions/regions-findone-filter.vo';

export abstract class RegionsFindoneRepository {
    abstract read(
        filter: RegionsFindoneFilter | null,
    ): Observable<RegionsFindoneEntity>;
}
