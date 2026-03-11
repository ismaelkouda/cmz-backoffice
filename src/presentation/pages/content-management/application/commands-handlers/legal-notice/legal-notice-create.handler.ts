import { Injectable } from '@angular/core';
import { LegalNoticeCreateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-create.command';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
