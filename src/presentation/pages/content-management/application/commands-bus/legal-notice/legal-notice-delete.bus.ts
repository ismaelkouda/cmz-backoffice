import { Injectable, inject } from '@angular/core';
import { LegalNoticeDeleteCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-delete.command';
import { LegalNoticeDeleteHandler } from '@pages/content-management/application/commands-handlers/legal-notice/legal-notice-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeDeleteBus {
    private readonly filterHandler = inject(LegalNoticeDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
