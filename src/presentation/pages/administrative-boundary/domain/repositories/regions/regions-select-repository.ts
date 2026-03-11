import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { Observable } from 'rxjs';

export abstract class RegionsSelectRepository {
    abstract execute(): Observable<RegionsSelectEntity[]>;
}
