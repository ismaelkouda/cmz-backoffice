import { DownloadFilterContract } from '@pages/report-states/domain/contracts/download/download-filter.contract';
import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class DownloadRepository {
    abstract execute(
        entity: DownloadFilterContract | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DownloadEntity>>;
}
