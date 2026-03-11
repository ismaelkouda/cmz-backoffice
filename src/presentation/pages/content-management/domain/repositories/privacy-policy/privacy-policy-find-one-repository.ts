import { Injectable } from '@angular/core';
import { PrivacyPolicyFindOneFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one-filter.entity';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class PrivacyPolicyFindOneRepository {
    abstract execute(
        filter: PrivacyPolicyFindOneFilterEntity
    ): Observable<PrivacyPolicyFindOneEntity>;
}
