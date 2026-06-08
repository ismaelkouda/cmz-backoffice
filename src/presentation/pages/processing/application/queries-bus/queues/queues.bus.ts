import { Injectable, inject } from '@angular/core';
import { QueuesQuery } from '@pages/processing/application/queries/queues/queues.query';
import { QueuesHandler } from '@pages/processing/application/queries-handlers/queues/queues.handler';
import { QueuesEntity } from '@pages/processing/domain/entities/queues/queues.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesBus {
    private readonly filterHandler = inject(QueuesHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<QueuesEntity>> {
        if (query instanceof QueuesQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
