import { AccessLogsFilterEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class AccessLogsRepository {
    abstract readAll(
        filter: AccessLogsFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AccessLogsEntity>>;
}
