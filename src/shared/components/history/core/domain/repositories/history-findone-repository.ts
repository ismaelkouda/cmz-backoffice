import { Observable } from 'rxjs';

import { HistoryFindOneFilterEntity } from '@shared/components/history/core/domain/entities/history-findone-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/core/domain/entities/history-findone.entity';

export abstract class HistoryFindonRepository {
    abstract read(
        filter: HistoryFindOneFilterEntity
    ): Observable<HistoryFindOneEntity>;
}
