import { Injectable } from '@angular/core';
import { LegalNoticeFindOneFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class LegalNoticeFindOneRepository {
    abstract execute(
        filter: LegalNoticeFindOneFilterEntity
    ): Observable<LegalNoticeFindOneEntity>;
}
