import { Injectable } from '@angular/core';
import { PrivacyPolicyQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy.query';
import { PrivacyPolicyHandler } from '@pages/content-management/application/queries-handlers/privacy-policy/privacy-policy.handler';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyBus {
    constructor(private readonly filterHandler: PrivacyPolicyHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        if (query instanceof PrivacyPolicyQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
