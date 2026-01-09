import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { QueuesEntity } from '../entities/queues/queues.entity';
import { QueuesRepository } from '../repositories/queues.repository';
import { QueuesFilter } from '../value-objects/queues-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchQueuesUseCase {
    private readonly queuesRepository = inject(QueuesRepository);

    execute(
        filter: QueuesFilter | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.queuesRepository.fetchQueues(filter, page);
    }
}
