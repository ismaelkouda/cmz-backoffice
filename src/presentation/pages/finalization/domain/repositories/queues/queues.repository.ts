import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { QueuesFilterEntity } from '@presentation/pages/finalization/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@presentation/pages/finalization/domain/entities/queues/queues.entity';

export abstract class QueuesRepository {
    abstract execute(
        entity: QueuesFilterEntity | null,
        page: string
    ): Observable<Paginate<QueuesEntity>>;
}
