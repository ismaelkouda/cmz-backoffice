import { Injectable, inject } from '@angular/core';
import { LegalNoticeUpdateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-update.command';
import { LegalNoticeUpdateHandler } from '@pages/content-management/application/commands-handlers/legal-notice/legal-notice-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUpdateBus {
    private readonly updateHandler = inject(LegalNoticeUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
