import { Injectable } from '@angular/core';
import { TermsUseFindOneFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TermsUseFindOneRepository {
    abstract execute(
        filter: TermsUseFindOneFilterEntity
    ): Observable<TermsUseFindOneEntity>;
}
