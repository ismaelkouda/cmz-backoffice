import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { QueuesEntity } from '../../domain/entities/queues/queues.entity';
import { QueuesRepository } from '../../domain/repositories/queues.repository';
import { QueuesFilter } from '../../domain/value-objects/queues-filter.vo';
import { QueuesMapper } from '../mappers/queues.mapper';
import { QueuesApi } from '../sources/queues.api';

@Injectable({ providedIn: 'root' })
export class QueuesRepositoryImpl extends QueuesRepository {
    constructor(
        private readonly queuesApi: QueuesApi,
        private readonly queuesMapper: QueuesMapper
    ) {
        super();
    }

    fetchQueues(
        filter: QueuesFilter | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.queuesApi
            .fetchQueues(filter?.toDto() ?? {}, page)
            .pipe(map((response) => this.queuesMapper.mapFromDto(response)));
    }
}
