import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { QueuesQuery } from '@presentation/pages/processing/application/queries/queues/queues.query';
import { QueuesHandler } from '@presentation/pages/processing/application/queries-handlers/queues/queues.handler';
import { QueuesEntity } from '@presentation/pages/processing/domain/entities/queues/queues.entity';

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
