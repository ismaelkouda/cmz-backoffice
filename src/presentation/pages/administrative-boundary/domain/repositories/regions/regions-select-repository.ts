import { Observable } from 'rxjs';

import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-select.entity';

export abstract class RegionsSelectRepository {
    abstract execute(): Observable<RegionsSelectEntity[]>;
}
