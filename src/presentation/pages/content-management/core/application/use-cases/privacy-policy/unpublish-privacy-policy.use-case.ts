import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
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
