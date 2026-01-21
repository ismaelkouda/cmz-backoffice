import { inject, Injectable } from "@angular/core";
import { AccessLogsEntity } from "@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity";
import { AccessLogsRepository } from "@presentation/pages/settings-security/core/domain/repositories/access-logs/access-logs.repository";
import { AccessLogsFilterVo } from "@presentation/pages/settings-security/core/domain/value-objects/access-logs-filter.vo";
import { AccessLogsFilterMapper } from "@presentation/pages/settings-security/infrastructure/data/mappers/access-logs/access-logs-filter.mapper";
import { AccessLogsMapper } from "@presentation/pages/settings-security/infrastructure/data/mappers/access-logs/access-logs.mapper";
import { AccessLogsApi } from "@presentation/pages/settings-security/infrastructure/data/sources/access-logs/access-logs.api";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { map, Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AccessLogsRepositoryImpl implements AccessLogsRepository {
    private readonly api = inject(AccessLogsApi);
    private readonly mapper = inject(AccessLogsMapper);

    readAll(filter: AccessLogsFilterVo, page: string): Observable<Paginate<AccessLogsEntity>> {
        const paramsDto = AccessLogsFilterMapper.toApiDto(filter);
        return this.api.readAll(paramsDto, page).pipe(map((response) => this.mapper.mapFromDto(response)));
    }

}