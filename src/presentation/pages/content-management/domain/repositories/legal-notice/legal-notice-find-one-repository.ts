import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LegalNoticeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class LegalNoticeFindOneRepository {
    abstract execute(
        filter: LegalNoticeFindOneFilterEntity
    ): Observable<LegalNoticeFindOneEntity>;
}
