import { inject, Injectable } from '@angular/core';
import { EvaluateFilterContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { EvaluateRepository } from '@pages/report-states/domain/repositories/evaluate/evaluate.repository';
import { EvaluateFilterMapper } from '@pages/report-states/infrastructure/data/mappers/evaluate/evaluate-filter.mapper';
import { EvaluateMapper } from '@pages/report-states/infrastructure/data/mappers/evaluate/evaluate.mapper';
import { EvaluateApi } from '@pages/report-states/infrastructure/data/sources/evaluate/evaluate.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { EvaluateDownloadEntity } from '@presentation/pages/report-states/domain/entities/evaluate/evaluate-download.entity';
import { EvaluateDownloadMapper } from '@pages/report-states/infrastructure/data/mappers/evaluate/evaluate-download.mapper';

@Injectable({
    providedIn: 'root',
})
export class EvaluateRepositoryImpl extends EvaluateRepository {
    private readonly api = inject(EvaluateApi);
    private readonly mapper = inject(EvaluateMapper);
    private readonly filterMapper = inject(EvaluateFilterMapper);
    private readonly downloadMapper = inject(EvaluateDownloadMapper);

    execute(
        entity: EvaluateFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
    download(entity: EvaluateDownloadEntity): Observable<MessageResponseDto> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
