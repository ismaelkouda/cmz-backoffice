import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TermsUseFindOneQuery } from '@presentation/pages/content-management/application/queries/terms-use/terms-use-find-one.query';
import { TermsUseFindOneHandler } from '@presentation/pages/content-management/application/queries-handlers/terms-use/terms-use-find-one.handler';
import { TermsUseFindOneEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneBus {
    constructor(private readonly filterHandler: TermsUseFindOneHandler) {}

    dispatch<T>(query: T): Observable<TermsUseFindOneEntity> {
        if (query instanceof TermsUseFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
