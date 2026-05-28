import { Injectable, inject } from '@angular/core';
import { QueuesQuery } from '@pages/finalization/application/queries/queues/queues.query';
import { QueuesHandler } from '@pages/finalization/application/queries-handlers/queues/queues.handler';
import { QueuesEntity } from '@pages/finalization/domain/entities/queues/queues.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesBus {
    private readonly filterHandler = inject(QueuesHandler);

    dispatch<T>(query: T, page: string): Observable<Paginate<QueuesEntity>> {
        if (query instanceof QueuesQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
