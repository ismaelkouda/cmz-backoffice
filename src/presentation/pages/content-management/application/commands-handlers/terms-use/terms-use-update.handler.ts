import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseUpdateCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-update.command';
import { TermsUseUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use.use-case';

@Injectable({ providedIn: 'root' })
export class TermsUseUpdateHandler {
    constructor(private readonly useCase: TermsUseUseCase) {}

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
