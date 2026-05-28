import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyCreateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-create.command';
import { PrivacyPolicyUseCase } from '@pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyCreateHandler {
    private readonly useCase = inject(PrivacyPolicyUseCase);

    execute(
        command: PrivacyPolicyCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            version: command.version,
            content: command.content,
        });
    }
}
