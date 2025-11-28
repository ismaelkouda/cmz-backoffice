import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { AllEntity } from '../entities/all/all.entity';
import { AllFilter } from '../value-objects/all-filter.vo';

export abstract class AllRepository {
    abstract fetchAll(
        filter: AllFilter,
        page: string
    ): Observable<Paginate<AllEntity>>;
}
