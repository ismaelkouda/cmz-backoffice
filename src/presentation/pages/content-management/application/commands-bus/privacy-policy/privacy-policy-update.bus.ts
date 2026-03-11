import { Injectable } from '@angular/core';
import { PrivacyPolicyUpdateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-update.command';
import { PrivacyPolicyUpdateHandler } from '@pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyUpdateBus {
    constructor(private readonly updateHandler: PrivacyPolicyUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
