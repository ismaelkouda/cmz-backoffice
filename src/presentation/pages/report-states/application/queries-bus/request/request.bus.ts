import { Injectable, inject } from '@angular/core';
import { RequestQuery } from '@pages/report-states/application/queries/request/request.query';
import { RequestHandler } from '@pages/report-states/application/queries-handlers/request/request.handler';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestBus {
    private readonly filterHandler = inject(RequestHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RequestEntity>> {
        if (query instanceof RequestQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
