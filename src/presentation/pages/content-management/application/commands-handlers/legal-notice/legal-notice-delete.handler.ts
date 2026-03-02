import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeDeleteCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-delete.command';
import { LegalNoticeUseCase } from '@presentation/pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';

@Injectable({ providedIn: 'root' })
export class LegalNoticeDeleteHandler {
    constructor(private readonly useCase: LegalNoticeUseCase) {}

    execute(
        command: LegalNoticeDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
