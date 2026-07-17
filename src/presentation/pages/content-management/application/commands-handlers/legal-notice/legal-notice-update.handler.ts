import { legalNoticeUpdateCommandMapper } from '@pages/content-management/application/commands-mappers/legal-notice/legal-notice-update.mapper';
import { Injectable, inject } from '@angular/core';
import { LegalNoticeUpdateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-update.command';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeUpdateHandler {
    private readonly useCase = inject(LegalNoticeUseCase);

    execute(
        command: LegalNoticeUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(legalNoticeUpdateCommandMapper(command));
    }
}
