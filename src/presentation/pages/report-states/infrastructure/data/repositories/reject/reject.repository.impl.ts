import { inject, Injectable } from '@angular/core';
import { RejectFilterContract } from '@pages/report-states/domain/contracts/reject/reject-filter.contract';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { RejectRepository } from '@pages/report-states/domain/repositories/reject/reject.repository';
import { RejectFilterMapper } from '@pages/report-states/infrastructure/data/mappers/reject/reject-filter.mapper';
import { RejectMapper } from '@pages/report-states/infrastructure/data/mappers/reject/reject.mapper';
import { RejectApi } from '@pages/report-states/infrastructure/data/sources/reject/reject.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { RejectDownloadEntity } from '@presentation/pages/report-states/domain/entities/reject/reject-download.entity';
import { RejectDownloadMapper } from '@pages/report-states/infrastructure/data/mappers/reject/reject-download.mapper';

@Injectable({
    providedIn: 'root',
})
export class RejectRepositoryImpl extends RejectRepository {
    private readonly api = inject(RejectApi);
    private readonly mapper = inject(RejectMapper);
    private readonly filterMapper = inject(RejectFilterMapper);
    private readonly downloadMapper = inject(RejectDownloadMapper);

    execute(
        entity: RejectFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
    download(
        entity: RejectDownloadEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
