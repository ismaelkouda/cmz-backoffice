import { CloseFilterContract } from '@pages/report-states/domain/contracts/close/close-filter.contract';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { CloseDownloadEntity } from '@pages/report-states/domain/entities/close/close-download.entity';

export abstract class CloseRepository {
    abstract execute(
        filter: CloseFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity>>;
    abstract download(
        entity: CloseDownloadEntity
    ): Observable<SimpleResponseDto<void>>;
}
