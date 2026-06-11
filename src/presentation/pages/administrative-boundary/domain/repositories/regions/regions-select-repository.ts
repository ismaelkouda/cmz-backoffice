import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class RegionsSelectRepository {
    abstract execute(options?: FetchOptions): Observable<RegionsSelectEntity[]>;
}
