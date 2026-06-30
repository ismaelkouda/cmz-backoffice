import { inject, Injectable } from '@angular/core';
import { DownloadFilterContract } from '@pages/report-states/domain/contracts/download/download-filter.contract';
import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { DownloadRepository } from '@pages/report-states/domain/repositories/download/download.repository';
import { DownloadFilterMapper } from '@pages/report-states/infrastructure/data/mappers/download/download-filter.mapper';
import { DownloadMapper } from '@pages/report-states/infrastructure/data/mappers/download/download.mapper';
import { DownloadApi } from '@pages/report-states/infrastructure/data/sources/download/download.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DownloadRepositoryImpl extends DownloadRepository {
    private readonly api = inject(DownloadApi);
    private readonly mapper = inject(DownloadMapper);
    private readonly filterMapper = inject(DownloadFilterMapper);

    execute(
        entity: DownloadFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DownloadEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
