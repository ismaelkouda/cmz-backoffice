import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeQuery } from '@presentation/pages/content-management/application/queries/legal-notice/legal-notice.query';
import { LegalNoticeHandler } from '@presentation/pages/content-management/application/queries-handlers/legal-notice/legal-notice.handler';
import { LegalNoticeEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice.entity';

@Injectable({ providedIn: 'root' })
export class LegalNoticeBus {
    constructor(private readonly filterHandler: LegalNoticeHandler) {}

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
