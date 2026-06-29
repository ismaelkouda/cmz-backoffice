import { inject, Injectable } from '@angular/core';
import { ApproveFilterContract } from '@pages/report-states/domain/contracts/approve/approve-filter.contract';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { ApproveRepository } from '@pages/report-states/domain/repositories/approve/approve.repository';
import { ApproveFilterMapper } from '@pages/report-states/infrastructure/data/mappers/approve/approve-filter.mapper';
import { ApproveMapper } from '@pages/report-states/infrastructure/data/mappers/approve/approve.mapper';
import { ApproveApi } from '@pages/report-states/infrastructure/data/sources/approve/approve.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { ApproveDownloadEntity } from '@presentation/pages/report-states/domain/entities/approve/approve-download.entity';
import { ApproveDownloadMapper } from '@pages/report-states/infrastructure/data/mappers/approve/approve-download.mapper';

@Injectable({
    providedIn: 'root',
})
export class ApproveRepositoryImpl extends ApproveRepository {
    private readonly api = inject(ApproveApi);
    private readonly mapper = inject(ApproveMapper);
    private readonly filterMapper = inject(ApproveFilterMapper);
    private readonly downloadMapper = inject(ApproveDownloadMapper);

    execute(
        entity: ApproveFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
    download(
        entity: ApproveDownloadEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
