import { Injectable, inject } from '@angular/core';
import { TermsUseUpdateCommand } from '@pages/content-management/application/commands/terms-use/terms-use-update.command';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseUpdateHandler {
    private readonly useCase = inject(TermsUseUseCase);

    execute(
        command: TermsUseUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            version: command.version,
            content: command.content,
        });
    }
}
