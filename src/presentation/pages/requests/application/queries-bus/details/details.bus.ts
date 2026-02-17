import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DetailsQuery } from '@presentation/pages/requests/application/queries/details/details.query';
import { DetailsHandler } from '@presentation/pages/requests/application/queries-handlers/details/details.handler';
import { DetailsEntity } from '@presentation/pages/requests/domain/entities/details/details.entity';

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
