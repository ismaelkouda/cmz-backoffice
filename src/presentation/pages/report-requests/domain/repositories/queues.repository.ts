import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';

export abstract class QueuesRepository {
    abstract fetchQueues(
        filter: QueuesFilter,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
