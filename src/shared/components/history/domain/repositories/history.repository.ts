import { Injectable } from '@angular/core';
import { HistoryFilterEntity } from '@shared/components/history/domain/entities/history-filter.entity';
import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class HistoryRepository {
    abstract readAll(
        filter: HistoryFilterEntity | null,
        page: string
    ): Observable<Paginate<HistoryEntity>>;
}
