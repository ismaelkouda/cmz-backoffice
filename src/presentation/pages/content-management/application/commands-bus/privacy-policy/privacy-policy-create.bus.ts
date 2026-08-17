import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyCreateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-create.command';
import { PrivacyPolicyCreateHandler } from '@pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyCreateBus {
    private readonly createHandler = inject(PrivacyPolicyCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
