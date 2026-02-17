import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyRepository } from '../../../domain/repositories/privacy-policy.repository';

@Injectable({
    providedIn: 'root',
})
export class UnpublishPrivacyPolicyUseCase {
    constructor(private readonly repository: PrivacyPolicyRepository) {}

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.unpublishPrivacyPolicy(id);
    }
}
