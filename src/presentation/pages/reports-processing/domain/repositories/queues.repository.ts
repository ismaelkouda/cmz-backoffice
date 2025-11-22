import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { QueuesEntity } from '../entities/queues/queues.entity';
import { QueuesFilter } from '../value-objects/queues-filter.vo';

export abstract class QueuesRepository {
    abstract fetchQueues(
        filter: QueuesFilter,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
