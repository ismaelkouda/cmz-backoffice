import { inject, Injectable } from '@angular/core';
import { AccessLogsFilterEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { AccessLogsRepository } from '@pages/settings-security/domain/repositories/access-logs/access-logs.repository';
import { AccessLogsFilterMapper } from '@pages/settings-security/infrastructure/data/mappers/access-logs/access-logs-filter.mapper';
import { AccessLogsMapper } from '@pages/settings-security/infrastructure/data/mappers/access-logs/access-logs.mapper';
import { AccessLogsApi } from '@pages/settings-security/infrastructure/data/sources/access-logs/access-logs.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessLogsRepositoryImpl implements AccessLogsRepository {
    private readonly api = inject(AccessLogsApi);
    private readonly mapper = inject(AccessLogsMapper);

    readAll(
        filter: AccessLogsFilterEntity,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        const paramsDto = AccessLogsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
