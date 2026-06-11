import { Injectable } from '@angular/core';
import { LegalNoticeFindOneFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class LegalNoticeFindOneRepository {
    abstract execute(
        filter: LegalNoticeFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<LegalNoticeFindOneEntity>;
}
