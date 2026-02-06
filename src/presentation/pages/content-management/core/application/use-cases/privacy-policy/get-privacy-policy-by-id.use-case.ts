import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrivacyPolicyRepository } from '@presentation/pages/content-management/core/domain/repositories/privacy-policy.repository';

import { GetPrivacyPolicyByIdEntity } from '../../../domain/entities/get-privacy-policy-by-id.entity';

@Injectable({
    providedIn: 'root',
})
export class GetPrivacyPolicyByIdUseCase {
    constructor(private readonly repository: PrivacyPolicyRepository) {}

    execute(id: string): Observable<GetPrivacyPolicyByIdEntity> {
        return this.repository.getPrivacyPolicyById(id);
    }
}
