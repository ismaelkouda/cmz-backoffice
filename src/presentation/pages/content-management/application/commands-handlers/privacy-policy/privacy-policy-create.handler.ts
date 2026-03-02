import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyCreateCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-create.command';
import { PrivacyPolicyUseCase } from '@presentation/pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyCreateHandler {
    constructor(private readonly useCase: PrivacyPolicyUseCase) {}

    execute(
        command: PrivacyPolicyCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            version: command.version,
            content: command.content,
        });
    }
}
