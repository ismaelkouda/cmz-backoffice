import { privacyPolicyUpdateCommandMapper } from '@pages/content-management/application/commands-mappers/privacy-policy/privacy-policy-update.mapper';
import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyUpdateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-update.command';
import { PrivacyPolicyUseCase } from '@pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyUpdateHandler {
    private readonly useCase = inject(PrivacyPolicyUseCase);

    execute(
        command: PrivacyPolicyUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(privacyPolicyUpdateCommandMapper(command));
    }
}
