import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyPublishCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-publish.command';
import { PrivacyPolicyUseCase } from '@presentation/pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyPublishHandler {
    constructor(private readonly useCase: PrivacyPolicyUseCase) {}

    execute(
        command: PrivacyPolicyPublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish({
            uniqId: command.uniqId,
        });
    }
}
