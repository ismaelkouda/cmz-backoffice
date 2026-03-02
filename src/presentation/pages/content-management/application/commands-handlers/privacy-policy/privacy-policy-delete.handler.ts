import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyDeleteCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-delete.command';
import { PrivacyPolicyUseCase } from '@presentation/pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyDeleteHandler {
    constructor(private readonly useCase: PrivacyPolicyUseCase) {}

    execute(
        command: PrivacyPolicyDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
