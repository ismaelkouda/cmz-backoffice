/* import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { AccessLogsEntity } from '../../domain/entities/access-logs/access-logs.entity';
import { AccessLogsRepository } from '../../domain/repositories/access-logs.repository';
import { AccessLogsFilter } from '../../domain/value-objects/access-logs-filter.vo';
import { AccessLogsMapper } from '../mappers/access-logs.mapper';
import { AccessLogsApi } from '../sources/access-logs.api';

@Injectable({ providedIn: 'root' })
export class AccessLogsRepositoryImpl implements AccessLogsRepository {
    constructor(
        private readonly api: AccessLogsApi,
        private readonly mapper: AccessLogsMapper
    ) { }

    fetchAccessLogs(
        filter: AccessLogsFilter,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        return this.api.fetchAccessLogs(filter.toDto(), page).pipe(
            map((response) => this.mapper.mapFromDto(response))
        );
    }
}
 */