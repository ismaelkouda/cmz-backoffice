import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { PrivacyPolicyRepository } from '../../../domain/repositories/privacy-policy.repository';

@Injectable({
    providedIn: 'root',
})
export class UpdatePrivacyPolicyUseCase {
    constructor(private readonly repository: PrivacyPolicyRepository) { }

    execute(request: { id: string; params: FormData }): Observable<SimpleResponseDto<void>> {
        return this.repository.updatePrivacyPolicy(request.id, request.params);
    }
}
