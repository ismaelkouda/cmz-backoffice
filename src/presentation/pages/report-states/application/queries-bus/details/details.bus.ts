import { Injectable } from '@angular/core';
import { DetailsQuery } from '@pages/report-states/application/queries/details/details.query';
import { DetailsHandler } from '@pages/report-states/application/queries-handlers/details/details.handler';
import { DetailsEntity } from '@pages/report-states/domain/entities/details/details.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsBus {
    constructor(private readonly filterHandler: DetailsHandler) {}

    dispatch<T>(query: T): Observable<DetailsEntity> {
        if (query instanceof DetailsQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
