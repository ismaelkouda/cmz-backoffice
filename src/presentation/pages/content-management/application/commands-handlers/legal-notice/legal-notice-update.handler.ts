import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeUpdateCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-update.command';
import { LegalNoticeUseCase } from '@presentation/pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUpdateHandler {
    constructor(private readonly useCase: LegalNoticeUseCase) {}

    execute(
        command: LegalNoticeUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            version: command.version,
            content: command.content,
        });
    }
}
