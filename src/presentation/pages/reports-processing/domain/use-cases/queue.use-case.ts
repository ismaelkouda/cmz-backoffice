import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { QueueEntity } from '../entities/queue/queue.entity';
import { QueueRepository } from '../repositories/queue.repository';
import { QueueFilter } from '../value-objects/queue-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchQueueUseCase {
    private readonly queueRepository = inject(QueueRepository);

    execute(
        filter: QueueFilter,
        page: string
    ): Observable<Paginate<QueueEntity>> {
        return this.queueRepository.fetchQueue(filter, page);
    }
}
