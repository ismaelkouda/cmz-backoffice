import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyUpdateCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-update.command';
import { PrivacyPolicyUseCase } from '@presentation/pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyUpdateHandler {
    constructor(private readonly useCase: PrivacyPolicyUseCase) {}

    execute(
        command: PrivacyPolicyUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            version: command.version,
            content: command.content,
        });
    }
}
