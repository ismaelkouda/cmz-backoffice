import { EvaluateFilterContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { EvaluateDownloadEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-download.entity';
import { StatsDto as EvaluateStatsDto } from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-response-api.dto';

export abstract class EvaluateRepository {
    abstract execute(
        entity: EvaluateFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity, EvaluateStatsDto>>;
    abstract download(
        entity: EvaluateDownloadEntity
    ): Observable<MessageResponseDto>;
}
