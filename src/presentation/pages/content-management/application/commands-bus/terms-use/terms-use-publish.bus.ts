import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUsePublishCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-publish.command';
import { TermsUsePublishHandler } from '@presentation/pages/content-management/application/commands-handlers/terms-use/terms-use-publish.handler';

@Injectable({ providedIn: 'root' })
export class TermsUsePublishBus {
    constructor(private readonly filterHandler: TermsUsePublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TermsUsePublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
