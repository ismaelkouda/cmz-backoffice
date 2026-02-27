import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyUnpublishCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-unpublish.command';
import { PrivacyPolicyUseCase } from '@presentation/pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyUnpublishHandler {
    constructor(private readonly useCase: PrivacyPolicyUseCase) {}

    execute(
        command: PrivacyPolicyUnpublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.unpublish({
            uniqId: command.uniqId,
        });
    }
}
