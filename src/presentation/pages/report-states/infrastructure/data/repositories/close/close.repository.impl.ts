import { inject, Injectable } from '@angular/core';
import { CloseFilterEntity } from '@pages/report-states/domain/entities/close/close-filter.entity';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { CloseRepository } from '@pages/report-states/domain/repositories/close/close.repository';
import { CloseFilterMapper } from '@pages/report-states/infrastructure/data/mappers/close/close-filter.mapper';
import { CloseMapper } from '@pages/report-states/infrastructure/data/mappers/close/close.mapper';
import { CloseApi } from '@pages/report-states/infrastructure/data/sources/close/close.api';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CloseRepositoryImpl extends CloseRepository {
    private readonly api = inject(CloseApi);
    private readonly mapper = inject(CloseMapper);
    private readonly filterMapper = inject(CloseFilterMapper);

    execute(
        entity: CloseFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
