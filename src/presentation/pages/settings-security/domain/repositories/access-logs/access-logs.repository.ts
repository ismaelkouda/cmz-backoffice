import { AccessLogsFilterEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class AccessLogsRepository {
    abstract readAll(
        filter: AccessLogsFilterEntity | null,
        page: string
    ): Observable<Paginate<AccessLogsEntity>>;
}
