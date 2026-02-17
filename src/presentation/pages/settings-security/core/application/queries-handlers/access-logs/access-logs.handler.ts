import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AccessLogsQuery } from '@presentation/pages/settings-security/core/application/queries/access-logs/access-logs.query';
import { AccessLogsUseCase } from '@presentation/pages/settings-security/core/application/use-cases/access-logs/access-logs.use-case';
import { AccessLogsEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity';

@Injectable({ providedIn: 'root' })
export class AccessLogsHandler {
    constructor(private readonly useCase: AccessLogsUseCase) {}

    execute(
        query: AccessLogsQuery,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        return this.useCase.execute(
            {
                search: query.search,
                action: query.action,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
