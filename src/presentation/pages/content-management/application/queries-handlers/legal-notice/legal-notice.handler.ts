import { legalNoticeQueryMapper } from '@pages/content-management/application/queries-mappers/legal-notice/legal-notice.mapper';
import { Injectable, inject } from '@angular/core';
import { LegalNoticeQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice.query';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeHandler {
    private readonly useCase = inject(LegalNoticeUseCase);

    execute(
        command: LegalNoticeQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.useCase.execute(
            legalNoticeQueryMapper(command),
            page,
            options
        );
    }
}
