import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyFindOneQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';
import { PrivacyPolicyFindOneHandler } from '@pages/content-management/application/queries-handlers/privacy-policy/privacy-policy-find-one.handler';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneBus {
    private readonly filterHandler = inject(PrivacyPolicyFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<PrivacyPolicyFindOneEntity> {
        if (query instanceof PrivacyPolicyFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
