import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { QueuesFilterEntity } from '../entities/queues/queues-filter.entity';
import { QueuesEntity } from '../entities/queues/queues.entity';

export abstract class QueuesRepository {
    abstract fetchQueues(
        filter: QueuesFilterEntity | null,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
