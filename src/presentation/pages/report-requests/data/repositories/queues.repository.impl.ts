import { Injectable } from '@angular/core';
import { QueuesMapper } from '@presentation/pages/report-requests/data/mappers/queues.mapper';
import { QueuesApi } from '@presentation/pages/report-requests/data/sources/queues.api';
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@presentation/pages/report-requests/domain/repositories/queues.repository';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesRepositoryImpl extends QueuesRepository {
    constructor(
        private readonly api: QueuesApi,
        private readonly queuesMapper: QueuesMapper
    ) {
        super();
    }

    fetchQueues(
        filter: QueuesFilter | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.api.fetchQueues(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.queuesMapper.mapFromDto(response))
        );
    }
}
