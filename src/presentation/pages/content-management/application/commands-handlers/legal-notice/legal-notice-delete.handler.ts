import { Injectable, inject } from '@angular/core';
import { LegalNoticeDeleteCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-delete.command';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeDeleteHandler {
    private readonly useCase = inject(LegalNoticeUseCase);

    execute(
        command: LegalNoticeDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
