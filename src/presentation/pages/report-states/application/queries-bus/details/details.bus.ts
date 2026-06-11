import { Injectable, inject } from '@angular/core';
import { DetailsQuery } from '@pages/report-states/application/queries/details/details.query';
import { DetailsHandler } from '@pages/report-states/application/queries-handlers/details/details.handler';
import { DetailsEntity } from '@pages/report-states/domain/entities/details/details.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class DetailsBus {
    private readonly filterHandler = inject(DetailsHandler);

    dispatch<T>(query: T, options?: FetchOptions): Observable<DetailsEntity> {
        if (query instanceof DetailsQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
