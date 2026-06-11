import { Injectable } from '@angular/core';
import { HistoryFindOneFilterEntity } from '@shared/components/history/domain/entities/history-find-one-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class HistoryFindOneRepository {
    abstract read(
        filter: HistoryFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<HistoryFindOneEntity>;
}
