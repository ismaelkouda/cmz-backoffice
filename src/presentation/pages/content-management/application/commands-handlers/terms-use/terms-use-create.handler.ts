import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseCreateCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-create.command';
import { TermsUseUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use.use-case';

@Injectable({ providedIn: 'root' })
export class TermsUseCreateHandler {
    constructor(private readonly useCase: TermsUseUseCase) {}

    execute(
        command: TermsUseCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            version: command.version,
            content: command.content,
        });
    }
}
