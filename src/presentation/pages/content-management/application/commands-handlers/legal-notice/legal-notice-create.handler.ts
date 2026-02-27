import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { LegalNoticeCreateCommand } from '@presentation/pages/content-management/application/commands/legal-notice/legal-notice-create.command';
import { LegalNoticeUseCase } from '@presentation/pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';

@Injectable({ providedIn: 'root' })
export class LegalNoticeCreateHandler {
    constructor(private readonly useCase: LegalNoticeUseCase) {}

    execute(
        command: LegalNoticeCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            content: command.content,
            version: command.version,
        });
    }
}
