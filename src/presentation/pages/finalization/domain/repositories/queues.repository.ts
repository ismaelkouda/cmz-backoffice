import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { QueuesEntity } from '../entities/queues/queues.entity';
import { QueuesFilter } from '../value-objects/queues-filter.vo';

export abstract class QueuesRepository {
    abstract fetchQueues(
        filter: QueuesFilter | null,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
