import { inject, Injectable } from '@angular/core';
import { RequestFilterContract } from '@pages/report-states/domain/contracts/request/request-filter.contract';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { RequestRepository } from '@pages/report-states/domain/repositories/request/request.repository';
import { RequestFilterMapper } from '@pages/report-states/infrastructure/data/mappers/request/request-filter.mapper';
import { RequestMapper } from '@pages/report-states/infrastructure/data/mappers/request/request.mapper';
import { RequestApi } from '@pages/report-states/infrastructure/data/sources/request/request.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { RequestDownloadEntity } from '@presentation/pages/report-states/domain/entities/request/request-download.entity';
import { RequestDownloadMapper } from '@pages/report-states/infrastructure/data/mappers/request/request-download.mapper';

@Injectable({
    providedIn: 'root',
})
export class RequestRepositoryImpl extends RequestRepository {
    private readonly api = inject(RequestApi);
    private readonly mapper = inject(RequestMapper);
    private readonly filterMapper = inject(RequestFilterMapper);
    private readonly downloadMapper = inject(RequestDownloadMapper);

    execute(
        entity: RequestFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RequestEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
    download(entity: RequestDownloadEntity): Observable<MessageResponseDto> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
