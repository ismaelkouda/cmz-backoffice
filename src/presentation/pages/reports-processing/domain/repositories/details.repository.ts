import { Observable } from 'rxjs';

import { EndPointType } from '@shared/domain/types/end-point.types';

import { DetailsEntity } from '../entities/details/details.entity';
import { DetailsFilter } from '../value-objects/details-filter.vo';

export abstract class DetailsRepository {
    abstract fetchDetails(
        filter: DetailsFilter,
        endPointType?: EndPointType
    ): Observable<DetailsEntity>;
}
