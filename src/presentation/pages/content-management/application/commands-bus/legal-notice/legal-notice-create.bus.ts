import { Injectable, inject } from '@angular/core';
import { LegalNoticeCreateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-create.command';
import { LegalNoticeCreateHandler } from '@pages/content-management/application/commands-handlers/legal-notice/legal-notice-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeCreateBus {
    private readonly createHandler = inject(LegalNoticeCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof LegalNoticeCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
