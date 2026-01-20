import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-select.entity';
import { Observable } from 'rxjs';

export abstract class RegionsSelectRepository {
    abstract readAll(): Observable<Array<RegionsSelectEntity>>;
}
