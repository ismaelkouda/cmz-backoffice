import { AccessLogsEntity } from "@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity";
import { AccessLogsFilterVo } from "@presentation/pages/settings-security/core/domain/value-objects/access-logs-filter.vo";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { Observable } from "rxjs";

export abstract class AccessLogsRepository {
    abstract readAll(
        filter: AccessLogsFilterVo | null,
        page: string
    ): Observable<Paginate<AccessLogsEntity>>;
}