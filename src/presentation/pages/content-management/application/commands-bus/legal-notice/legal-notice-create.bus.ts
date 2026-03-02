import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeCreateCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-create.command';
import { LegalNoticeCreateHandler } from '@presentation/pages/content-management/application/commands-handlers/legal-notice/legal-notice-create.handler';

@Injectable({ providedIn: 'root' })
export class LegalNoticeCreateBus {
    constructor(private readonly createHandler: LegalNoticeCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
