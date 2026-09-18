import { AllFilterContract } from '@pages/report-states/domain/contracts/all/all-filter.contract';
import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { AllDownloadEntity } from '@presentation/pages/report-states/domain/entities/all/all-download.entity';
import { StatsDto as AllStatsDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';

export abstract class AllRepository {
    abstract execute(
        entity: AllFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity, AllStatsDto>>;

    abstract download(
        entity: AllDownloadEntity
    ): Observable<MessageResponseDto>;
}
