import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { StatsDto as QueuesStatsDto } from '@pages/requests/infrastructure/api/dto/queues/queues-response-api.dto';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class QueuesRepository {
    abstract execute(
        entity: QueuesFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<QueuesEntity, QueuesStatsDto>>;
}
