import { Injectable, inject } from '@angular/core';
import { TermsUseUnpublishCommand } from '@pages/content-management/application/commands/terms-use/terms-use-unpublish.command';
import { TermsUseUnpublishHandler } from '@pages/content-management/application/commands-handlers/terms-use/terms-use-unpublish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseUnpublishBus {
    private readonly filterHandler = inject(TermsUseUnpublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
