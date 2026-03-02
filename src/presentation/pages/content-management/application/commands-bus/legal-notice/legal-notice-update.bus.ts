import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeUpdateCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-update.command';
import { LegalNoticeUpdateHandler } from '@presentation/pages/content-management/application/commands-handlers/legal-notice/legal-notice-update.handler';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUpdateBus {
    constructor(private readonly updateHandler: LegalNoticeUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
