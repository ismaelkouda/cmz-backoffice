import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AccessLogsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity';

export abstract class AccessLogsRepository {
    abstract readAll(
        filter: AccessLogsFilterEntity | null,
        page: string
    ): Observable<Paginate<AccessLogsEntity>>;
}
