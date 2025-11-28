import { Injectable } from '@angular/core';
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@presentation/pages/report-requests/domain/repositories/queues.repository';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FetchQueuesUseCase {
    constructor(private readonly queuesRepository: QueuesRepository) {}

    execute(
        filter: QueuesFilter,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        return this.queuesRepository.fetchQueues(filter, page);
    }
}
