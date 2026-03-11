import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class QueuesRepository {
    abstract execute(
        entity: QueuesFilterEntity | null,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
