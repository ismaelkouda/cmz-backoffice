import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeUnpublishCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-unpublish.command';
import { LegalNoticeUnpublishHandler } from '@presentation/pages/content-management/application/commands-handlers/legal-notice/legal-notice-unpublish.handler';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUnpublishBus {
    constructor(private readonly filterHandler: LegalNoticeUnpublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
