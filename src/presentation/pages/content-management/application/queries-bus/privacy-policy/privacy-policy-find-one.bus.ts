import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrivacyPolicyFindOneQuery } from '@presentation/pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';
import { PrivacyPolicyFindOneHandler } from '@presentation/pages/content-management/application/queries-handlers/privacy-policy/privacy-policy-find-one.handler';
import { PrivacyPolicyFindOneEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneBus {
    constructor(private readonly filterHandler: PrivacyPolicyFindOneHandler) {}

    dispatch<T>(query: T): Observable<PrivacyPolicyFindOneEntity> {
        if (query instanceof PrivacyPolicyFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
