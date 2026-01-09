import { Observable } from 'rxjs';
import { DetailsEntity } from '../entities/details/details.entity';
import { DetailsFilter } from '../value-objects/details-filter.vo';

export abstract class DetailsRepository {
    abstract fetchDetails(
        filter: DetailsFilter,
        endPointType?: EndPointType
    ): Observable<DetailsEntity>;
}
