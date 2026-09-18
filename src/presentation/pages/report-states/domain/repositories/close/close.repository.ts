import { CloseFilterContract } from '@pages/report-states/domain/contracts/close/close-filter.contract';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { CloseDownloadEntity } from '@pages/report-states/domain/entities/close/close-download.entity';
import { StatsDto as CloseStatsDto } from '@pages/report-states/infrastructure/api/dto/close/close-response-api.dto';

export abstract class CloseRepository {
    abstract execute(
        filter: CloseFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity, CloseStatsDto>>;
    abstract download(
        entity: CloseDownloadEntity
    ): Observable<MessageResponseDto>;
}
