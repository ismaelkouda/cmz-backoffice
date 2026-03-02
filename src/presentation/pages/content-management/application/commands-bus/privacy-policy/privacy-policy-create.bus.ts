import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyCreateCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-create.command';
import { PrivacyPolicyCreateHandler } from '@presentation/pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-create.handler';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyCreateBus {
    constructor(private readonly createHandler: PrivacyPolicyCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
