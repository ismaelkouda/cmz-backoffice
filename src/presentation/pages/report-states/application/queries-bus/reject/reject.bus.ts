import { Injectable, inject } from '@angular/core';
import { RejectQuery } from '@pages/report-states/application/queries/reject/reject.query';
import { RejectHandler } from '@pages/report-states/application/queries-handlers/reject/reject.handler';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectBus {
    private readonly filterHandler = inject(RejectHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>> {
        if (query instanceof RejectQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
