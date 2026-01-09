import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class QueuesRepository {
    abstract fetchQueues(
        filter: QueuesFilter | null,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
