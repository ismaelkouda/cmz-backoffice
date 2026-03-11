import { Injectable } from '@angular/core';
import { QueuesQuery } from '@pages/requests/application/queries/queues/queues.query';
import { QueuesHandler } from '@pages/requests/application/queries-handlers/queues/queues.handler';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesBus {
    constructor(private readonly filterHandler: QueuesHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<QueuesEntity>> {
        if (query instanceof QueuesQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
