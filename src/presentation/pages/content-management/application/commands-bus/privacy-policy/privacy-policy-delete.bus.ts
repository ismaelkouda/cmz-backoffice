import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyDeleteCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-delete.command';
import { PrivacyPolicyDeleteHandler } from '@presentation/pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-delete.handler';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyDeleteBus {
    constructor(private readonly filterHandler: PrivacyPolicyDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
