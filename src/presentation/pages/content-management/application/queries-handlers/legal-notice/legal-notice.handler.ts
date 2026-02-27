import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeQuery } from '@presentation/pages/content-management/application/queries/legal-notice/legal-notice.query';
import { LegalNoticeUseCase } from '@presentation/pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { LegalNoticeEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice.entity';

@Injectable({ providedIn: 'root' })
export class LegalNoticeHandler {
    constructor(private readonly useCase: LegalNoticeUseCase) {}

    execute(
        command: LegalNoticeQuery,
        page: string
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                version: command.version,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
