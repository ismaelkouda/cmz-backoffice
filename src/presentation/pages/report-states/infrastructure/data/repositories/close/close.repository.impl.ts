import { inject, Injectable } from '@angular/core';
import { CloseFilterContract } from '@pages/report-states/domain/contracts/close/close-filter.contract';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { CloseRepository } from '@pages/report-states/domain/repositories/close/close.repository';
import { CloseFilterMapper } from '@pages/report-states/infrastructure/data/mappers/close/close-filter.mapper';
import { CloseMapper } from '@pages/report-states/infrastructure/data/mappers/close/close.mapper';
import { CloseApi } from '@pages/report-states/infrastructure/data/sources/close/close.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { CloseDownloadEntity } from '@presentation/pages/report-states/domain/entities/close/close-download.entity';
import { CloseDownloadMapper } from '../../mappers/close/close-download.mapper';

@Injectable({
    providedIn: 'root',
})
export class CloseRepositoryImpl extends CloseRepository {
    private readonly api = inject(CloseApi);
    private readonly mapper = inject(CloseMapper);
    private readonly filterMapper = inject(CloseFilterMapper);
    private readonly downloadMapper = inject(CloseDownloadMapper);

    execute(
        entity: CloseFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
    download(entity: CloseDownloadEntity): Observable<SimpleResponseDto<void>> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
