import { Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, map } from 'rxjs';
import { QueueEntity } from '../../domain/entities/queue/queue.entity';
import { QueueRepository } from '../../domain/repositories/queue.repository';
import { QueueFilter } from '../../domain/value-objects/queue-filter.vo';
import { QueueMapper } from '../mappers/queue.mapper';
import { QueueApi } from '../sources/queue.api';

@Injectable()
export class QueueRepositoryImpl extends QueueRepository {
    constructor(
        private readonly queueApi: QueueApi,
        private readonly queueMapper: QueueMapper
    ) {
        super();
    }

    fetchQueue(
        filter: QueueFilter,
        page: string
    ): Observable<Paginate<QueueEntity>> {
        return this.queueApi
            .fetchQueue(filter.toDto(), page)
            .pipe(map((response) => this.queueMapper.mapFromDto(response)));
    }
}
