import { Injectable, inject } from '@angular/core';
import { HistoryFindOneQuery } from '@shared/components/history/application/queries/history-find-one.query';
import { HistoryFindOneHandler } from '@shared/components/history/application/queries-handlers/history-find-one.handler';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneBus {
    private readonly filterHandler = inject(HistoryFindOneHandler);

    dispatch<T>(query: T): Observable<HistoryFindOneEntity> {
        if (query instanceof HistoryFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
