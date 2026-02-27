import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeDeleteCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-delete.command';
import { LegalNoticeDeleteHandler } from '@presentation/pages/content-management/application/commands-handlers/legal-notice/legal-notice-delete.handler';

@Injectable({ providedIn: 'root' })
export class LegalNoticeDeleteBus {
    constructor(private readonly filterHandler: LegalNoticeDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
