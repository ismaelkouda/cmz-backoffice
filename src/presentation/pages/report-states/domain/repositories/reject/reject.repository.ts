import { RejectFilterContract } from '@pages/report-states/domain/contracts/reject/reject-filter.contract';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { RejectDownloadEntity } from '@pages/report-states/domain/entities/reject/reject-download.entity';
import { StatsDto as RejectStatsDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-response-api.dto';

export abstract class RejectRepository {
    abstract execute(
        entity: RejectFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity, RejectStatsDto>>;
    abstract download(
        entity: RejectDownloadEntity
    ): Observable<MessageResponseDto>;
}
