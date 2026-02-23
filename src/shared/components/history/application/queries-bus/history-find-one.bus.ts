import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFindOneQuery } from '@shared/components/history/application/queries/history-find-one.query';
import { HistoryFindOneHandler } from '@shared/components/history/application/queries-handlers/history-find-one.handler';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneBus {
    constructor(private readonly filterHandler: HistoryFindOneHandler) {}

    dispatch<T>(query: T): Observable<HistoryFindOneEntity> {
        if (query instanceof HistoryFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
