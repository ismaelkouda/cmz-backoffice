import { Injectable, inject } from '@angular/core';
import { LegalNoticeFindOneQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';
import { LegalNoticeFindOneHandler } from '@pages/content-management/application/queries-handlers/legal-notice/legal-notice-find-one.handler';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneBus {
    private readonly filterHandler = inject(LegalNoticeFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<LegalNoticeFindOneEntity> {
        if (query instanceof LegalNoticeFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
