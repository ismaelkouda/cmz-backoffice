import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { QueueEntity } from '../entities/queue/queue.entity';
import { QueueFilter } from '../value-objects/queue-filter.vo';

export abstract class QueueRepository {
    abstract fetchQueue(
        filter: QueueFilter,
        page: string
    ): Observable<Paginate<QueueEntity>>;
}
