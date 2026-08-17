import { ApproveFilterContract } from '@pages/report-states/domain/contracts/approve/approve-filter.contract';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { ApproveDownloadEntity } from '@pages/report-states/domain/entities/approve/approve-download.entity';

export abstract class ApproveRepository {
    abstract execute(
        filter: ApproveFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>>;
    abstract download(
        entity: ApproveDownloadEntity
    ): Observable<MessageResponseDto>;
}
