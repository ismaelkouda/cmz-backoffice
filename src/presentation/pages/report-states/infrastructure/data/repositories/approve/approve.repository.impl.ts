import { inject, Injectable } from '@angular/core';
import { ApproveFilterEntity } from '@pages/report-states/domain/entities/approve/approve-filter.entity';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { ApproveRepository } from '@pages/report-states/domain/repositories/approve/approve.repository';
import { ApproveFilterMapper } from '@pages/report-states/infrastructure/data/mappers/approve/approve-filter.mapper';
import { ApproveMapper } from '@pages/report-states/infrastructure/data/mappers/approve/approve.mapper';
import { ApproveApi } from '@pages/report-states/infrastructure/data/sources/approve/approve.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApproveRepositoryImpl extends ApproveRepository {
    private readonly api = inject(ApproveApi);
    private readonly mapper = inject(ApproveMapper);
    private readonly filterMapper = inject(ApproveFilterMapper);

    execute(
        entity: ApproveFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
