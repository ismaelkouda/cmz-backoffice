import { legalNoticeCreateCommandMapper } from '@pages/content-management/application/commands-mappers/legal-notice/legal-notice-create.mapper';
import { Injectable, inject } from '@angular/core';
import { LegalNoticeCreateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-create.command';
import { LegalNoticeUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeCreateHandler {
    private readonly useCase = inject(LegalNoticeUseCase);

    execute(
        command: LegalNoticeCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create(legalNoticeCreateCommandMapper(command));
    }
}
