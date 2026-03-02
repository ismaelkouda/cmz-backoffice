import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseUnpublishCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-unpublish.command';
import { TermsUseUnpublishHandler } from '@presentation/pages/content-management/application/commands-handlers/terms-use/terms-use-unpublish.handler';

@Injectable({ providedIn: 'root' })
export class TermsUseUnpublishBus {
    constructor(private readonly filterHandler: TermsUseUnpublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUseUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
