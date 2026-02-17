import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFilterEntity } from '@shared/components/history/core/domain/entities/history-filter.entity';
import { HistoryEntity } from '@shared/components/history/core/domain/entities/history.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';

@Injectable({
    providedIn: 'root',
})
export abstract class HistoryRepository {
    abstract readAll(
        filter: HistoryFilterEntity | null,
        page: string
    ): Observable<Paginate<HistoryEntity>>;
}
