import { privacyPolicyPublishCommandMapper } from '@pages/content-management/application/commands-mappers/privacy-policy/privacy-policy-publish.mapper';
import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyPublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-publish.command';
import { PrivacyPolicyUseCase } from '@pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyPublishHandler {
    private readonly useCase = inject(PrivacyPolicyUseCase);

    execute(
        command: PrivacyPolicyPublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish(privacyPolicyPublishCommandMapper(command));
    }
}
