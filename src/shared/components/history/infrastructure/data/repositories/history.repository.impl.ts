import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { HistoryFilterEntity } from '../../../core/domain/entities/history-filter.entity';
import { HistoryEntity } from '../../../core/domain/entities/history.entity';
import { HistoryRepository } from '../../../core/domain/repositories/history.repository';
import { HistoryFilterMapper } from '../mappers/history-filter.mapper';
import { HistoryMapper } from '../mappers/history.mapper';
import { HistoryApi } from '../sources/history.api';

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
