import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LegalNoticeFindOneQuery } from '@presentation/pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';
import { LegalNoticeFindOneHandler } from '@presentation/pages/content-management/application/queries-handlers/legal-notice/legal-notice-find-one.handler';
import { LegalNoticeFindOneEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneBus {
    constructor(private readonly filterHandler: LegalNoticeFindOneHandler) {}

    dispatch<T>(query: T): Observable<LegalNoticeFindOneEntity> {
        if (query instanceof LegalNoticeFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
