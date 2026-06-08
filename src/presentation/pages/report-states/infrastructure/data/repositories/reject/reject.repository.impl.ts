import { inject, Injectable } from '@angular/core';
import { RejectFilterEntity } from '@pages/report-states/domain/entities/reject/reject-filter.entity';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { RejectRepository } from '@pages/report-states/domain/repositories/reject/reject.repository';
import { RejectFilterMapper } from '@pages/report-states/infrastructure/data/mappers/reject/reject-filter.mapper';
import { RejectMapper } from '@pages/report-states/infrastructure/data/mappers/reject/reject.mapper';
import { RejectApi } from '@pages/report-states/infrastructure/data/sources/reject/reject.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RejectRepositoryImpl extends RejectRepository {
    private readonly api = inject(RejectApi);
    private readonly mapper = inject(RejectMapper);
    private readonly filterMapper = inject(RejectFilterMapper);

    execute(
        entity: RejectFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
