import { Observable } from 'rxjs';

import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-select.entity';

export abstract class RegionsSelectRepository {
    abstract readAll(): Observable<RegionsSelectEntity[]>;
}
