import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyDeleteCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-delete.command';
import { PrivacyPolicyDeleteHandler } from '@pages/content-management/application/commands-handlers/privacy-policy/privacy-policy-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyDeleteBus {
    private readonly filterHandler = inject(PrivacyPolicyDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof PrivacyPolicyDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
