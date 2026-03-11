import { Injectable } from '@angular/core';
import { LegalNoticeUnpublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-unpublish.command';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUnpublishHandler {
    constructor(private readonly useCase: LegalNoticeUseCase) {}

    execute(
        command: LegalNoticeUnpublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.unpublish({
            uniqId: command.uniqId,
        });
    }
}
