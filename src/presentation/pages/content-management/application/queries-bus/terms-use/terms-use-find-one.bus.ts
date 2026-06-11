import { Injectable, inject } from '@angular/core';
import { TermsUseFindOneQuery } from '@pages/content-management/application/queries/terms-use/terms-use-find-one.query';
import { TermsUseFindOneHandler } from '@pages/content-management/application/queries-handlers/terms-use/terms-use-find-one.handler';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneBus {
    private readonly filterHandler = inject(TermsUseFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<TermsUseFindOneEntity> {
        if (query instanceof TermsUseFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
