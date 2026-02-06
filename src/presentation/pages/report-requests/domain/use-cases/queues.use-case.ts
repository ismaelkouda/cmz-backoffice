import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@presentation/pages/report-requests/domain/repositories/queues.repository';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';

@Injectable({ providedIn: 'root' })
export class FetchQueuesUseCase {
    private readonly queuesRepository = inject(QueuesRepository);

    execute(
        filter: QueuesFilter | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.queuesRepository.fetchQueues(filter, page);
    }
}
