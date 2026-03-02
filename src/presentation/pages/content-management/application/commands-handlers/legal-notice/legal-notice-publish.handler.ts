import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticePublishCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-publish.command';
import { LegalNoticeUseCase } from '@presentation/pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';

@Injectable({ providedIn: 'root' })
export class LegalNoticePublishHandler {
    constructor(private readonly useCase: LegalNoticeUseCase) {}

    execute(
        command: LegalNoticePublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish({
            uniqId: command.uniqId,
        });
    }
}
