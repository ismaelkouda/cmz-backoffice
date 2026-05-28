import { Injectable, inject } from '@angular/core';
import { AccessLogsQuery } from '@pages/settings-security/application/queries/access-logs/access-logs.query';
import { AccessLogsUseCase } from '@pages/settings-security/application/use-cases/access-logs/access-logs.use-case';
import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessLogsHandler {
    private readonly useCase = inject(AccessLogsUseCase);

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
