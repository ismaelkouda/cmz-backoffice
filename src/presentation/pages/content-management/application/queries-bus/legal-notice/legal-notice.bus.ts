import { Injectable, inject } from '@angular/core';
import { LegalNoticeQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice.query';
import { LegalNoticeHandler } from '@pages/content-management/application/queries-handlers/legal-notice/legal-notice.handler';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeBus {
    private readonly filterHandler = inject(LegalNoticeHandler);

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<LegalNoticeEntity>> {
        if (query instanceof LegalNoticeQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
