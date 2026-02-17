import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AccessLogsQuery } from '@presentation/pages/settings-security/core/application/queries/access-logs/access-logs.query';
import { AccessLogsHandler } from '@presentation/pages/settings-security/core/application/queries-handlers/access-logs/access-logs.handler';
import { AccessLogsEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity';

@Injectable({ providedIn: 'root' })
export class AccessLogsBus {
    constructor(private readonly filterHandler: AccessLogsHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        if (query instanceof AccessLogsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
