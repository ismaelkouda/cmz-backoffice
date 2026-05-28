import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyUnpublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-unpublish.command';
import { PrivacyPolicyUnpublishHandler } from '@pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-unpublish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyUnpublishBus {
    private readonly filterHandler = inject(PrivacyPolicyUnpublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
