import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { FinalizeEntity } from '../entities/finalize/finalize.entity';
import { FinalizeFilter } from '../value-objects/finalize-filter.vo';

export abstract class FinalizeRepository {
    abstract fetchFinalizes(
        filter: FinalizeFilter,
        page: string
    ): Observable<Paginate<FinalizeEntity>>;
}
