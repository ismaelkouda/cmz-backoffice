import { RejectFilterContract } from '@pages/report-states/domain/contracts/reject/reject-filter.contract';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { RejectDownloadEntity } from '@pages/report-states/domain/entities/reject/reject-download.entity';

export abstract class RejectRepository {
    abstract execute(
        entity: RejectFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>>;
    abstract download(
        entity: RejectDownloadEntity
    ): Observable<SimpleResponseDto<void>>;
}
