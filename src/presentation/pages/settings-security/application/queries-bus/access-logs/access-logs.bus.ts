import { Injectable, inject } from '@angular/core';
import { AccessLogsQuery } from '@pages/settings-security/application/queries/access-logs/access-logs.query';
import { AccessLogsHandler } from '@pages/settings-security/application/queries-handlers/access-logs/access-logs.handler';
import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessLogsBus {
    private readonly filterHandler = inject(AccessLogsHandler);

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
