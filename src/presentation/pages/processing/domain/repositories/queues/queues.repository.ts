import { QueuesFilterEntity } from '@pages/processing/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/processing/domain/entities/queues/queues.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class QueuesRepository {
    abstract execute(
        entity: QueuesFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<QueuesEntity>>;
}
