import { Observable } from 'rxjs';

import { HistoryFindOneFilterEntity } from '@shared/components/history/domain/entities/history-find-one-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';

export abstract class HistoryFindOneRepository {
    abstract read(
        filter: HistoryFindOneFilterEntity
    ): Observable<HistoryFindOneEntity>;
}
