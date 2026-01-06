/* import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { AccessLogsEntity } from '../entities/access-logs/access-logs.entity';
import { AccessLogsRepository } from '../repositories/access-logs.repository';
import { AccessLogsFilter } from '../value-objects/access-logs-filter.vo';

@Injectable({ providedIn: 'root' })
export class FetchAccessLogsUseCase {
    constructor(private readonly repository: AccessLogsRepository) { }

    execute(
        filter: AccessLogsFilter,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        return this.repository.fetchAccessLogs(filter, page);
    }
}
 */
