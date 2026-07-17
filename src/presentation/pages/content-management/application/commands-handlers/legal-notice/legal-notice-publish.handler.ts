import { legalNoticePublishCommandMapper } from '@pages/content-management/application/commands-mappers/legal-notice/legal-notice-publish.mapper';
import { Injectable, inject } from '@angular/core';
import { LegalNoticePublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-publish.command';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticePublishHandler {
    private readonly useCase = inject(LegalNoticeUseCase);

    execute(
        command: LegalNoticePublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish(legalNoticePublishCommandMapper(command));
    }
}
