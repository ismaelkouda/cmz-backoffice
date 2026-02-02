import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { PrivacyPolicyRepository } from '../../../domain/repositories/privacy-policy.repository';

@Injectable({
    providedIn: 'root',
})
export class CreatePrivacyPolicyUseCase {
    constructor(private readonly repository: PrivacyPolicyRepository) {}

    execute(params: FormData): Observable<SimpleResponseDto<void>> {
        return this.repository.createPrivacyPolicy(params);
    }
}
