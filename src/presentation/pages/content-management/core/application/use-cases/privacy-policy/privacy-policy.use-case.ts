import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { PrivacyPolicyEntity } from '../../../domain/entities/privacy-policy.entity';
import { PrivacyPolicyRepository } from '../../../domain/repositories/privacy-policy.repository';
import { PrivacyPolicyFilter } from '../../../domain/value-objects/privacy-policy-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchPrivacyPolicyUseCase {
    private readonly privacyPolicyRepository = inject(PrivacyPolicyRepository);

    execute(
        filter: PrivacyPolicyFilter,
        page: string
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.privacyPolicyRepository.fetchPrivacyPolicy(filter, page);
    }
}
