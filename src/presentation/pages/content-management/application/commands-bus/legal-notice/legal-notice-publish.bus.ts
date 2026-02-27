import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticePublishCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-publish.command';
import { LegalNoticePublishHandler } from '@presentation/pages/content-management/application/commands-handlers/legal-notice/legal-notice-publish.handler';

@Injectable({ providedIn: 'root' })
export class LegalNoticePublishBus {
    constructor(private readonly filterHandler: LegalNoticePublishHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticePublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
