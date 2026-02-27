import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TermsUseFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TermsUseFindOneRepository {
    abstract execute(
        filter: TermsUseFindOneFilterEntity
    ): Observable<TermsUseFindOneEntity>;
}
