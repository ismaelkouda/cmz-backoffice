import { RequestFilterContract } from '@pages/report-states/domain/contracts/request/request-filter.contract';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { RequestDownloadEntity } from '@pages/report-states/domain/entities/request/request-download.entity';

export abstract class RequestRepository {
    abstract execute(
        filter: RequestFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RequestEntity>>;
    abstract download(
        entity: RequestDownloadEntity
    ): Observable<MessageResponseDto>;
}
