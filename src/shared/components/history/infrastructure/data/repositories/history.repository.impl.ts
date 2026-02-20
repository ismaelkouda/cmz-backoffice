import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HistoryFilterEntity } from '@shared/components/history/domain/entities/history-filter.entity';
import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';
import { HistoryRepository } from '@shared/components/history/domain/repositories/history.repository';
import { HistoryFilterMapper } from '@shared/components/history/infrastructure/data/mappers/history-filter.mapper';
import { HistoryMapper } from '@shared/components/history/infrastructure/data/mappers/history.mapper';
import { HistoryApi } from '@shared/components/history/infrastructure/data/sources/history.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class HistoryRepositoryImpl implements HistoryRepository {
    private readonly api = inject(HistoryApi);
    private readonly mapper = inject(HistoryMapper);

    readAll(
        filter: HistoryFilterEntity,
        page: string
    ): Observable<Paginate<HistoryEntity>> {
        const paramsDto = HistoryFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
