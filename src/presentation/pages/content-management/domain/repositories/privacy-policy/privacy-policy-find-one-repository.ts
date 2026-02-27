import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrivacyPolicyFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one-filter.entity';
import { PrivacyPolicyFindOneEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class PrivacyPolicyFindOneRepository {
    abstract execute(
        filter: PrivacyPolicyFindOneFilterEntity
    ): Observable<PrivacyPolicyFindOneEntity>;
}
