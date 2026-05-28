import { Injectable, inject } from '@angular/core';
import { LegalNoticeUnpublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-unpublish.command';
import { LegalNoticeUnpublishHandler } from '@pages/content-management/application/commands-handlers/legal-notice/legal-notice-unpublish.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUnpublishBus {
    private readonly filterHandler = inject(LegalNoticeUnpublishHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeUnpublishCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
