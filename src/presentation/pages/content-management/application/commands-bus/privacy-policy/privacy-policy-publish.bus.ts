import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyPublishCommand } from '@presentation/pages/content-management/application/commands/privacy-policy/privacy-policy-publish.command';
import { PrivacyPolicyPublishHandler } from '@presentation/pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-publish.handler';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyPublishBus {
    constructor(private readonly filterHandler: PrivacyPolicyPublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyPublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
