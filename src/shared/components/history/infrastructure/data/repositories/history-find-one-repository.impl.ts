import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HistoryFindOneFilterEntity } from '@shared/components/history/domain/entities/history-find-one-filter.entity';
import { HistoryFindOneEntity } from '@shared/components/history/domain/entities/history-find-one.entity';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-find-one-repository';
import { historyFindOneFilterMapper } from '@shared/components/history/infrastructure/data/mappers/history-find-one-filter.mapper';
import { HistoryFindOneMapper } from '@shared/components/history/infrastructure/data/mappers/history-find-one.mapper';
import { HistoryFindOneApi } from '@shared/components/history/infrastructure/data/sources/history-find-one.api';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneRepositoryImpl implements HistoryFindOneRepository {
    private readonly api = inject(HistoryFindOneApi);
    private readonly mapper = inject(HistoryFindOneMapper);

    read(filter: HistoryFindOneFilterEntity): Observable<HistoryFindOneEntity> {
        const paramsDto = historyFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
