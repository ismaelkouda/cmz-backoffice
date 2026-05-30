import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyPublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-publish.command';
import { PrivacyPolicyPublishHandler } from '@pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-publish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyPublishBus {
    private readonly filterHandler = inject(PrivacyPolicyPublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyPublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
