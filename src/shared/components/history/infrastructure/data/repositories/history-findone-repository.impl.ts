import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HistoryFindOneFilterEntity } from '@shared/components/history/core/domain/entities/history-findone-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/core/domain/entities/history-findone.entity';
import { HistoryFindonRepository } from '@shared/components/history/core/domain/repositories/history-findone-repository';
import { historyFindOneFilterMapper } from '@shared/components/history/infrastructure/data/mappers/history-findone-filter.mapper';
import { HistoryFindonMapper } from '@shared/components/history/infrastructure/data/mappers/history-findone.mapper';
import { HistoryFindonApi } from '@shared/components/history/infrastructure/data/sources/history-findone.api';

@Injectable({ providedIn: 'root' })
export class HistoryFindonRepositoryImpl implements HistoryFindonRepository {
    private readonly api = inject(HistoryFindonApi);
    private readonly mapper = inject(HistoryFindonMapper);

    read(filter: HistoryFindOneFilterEntity): Observable<HistoryFindOneEntity> {
        const paramsDto = historyFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
