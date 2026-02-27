import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseUnpublishCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-unpublish.command';
import { TermsUseUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use.use-case';

@Injectable({ providedIn: 'root' })
export class TermsUseUnpublishHandler {
    constructor(private readonly useCase: TermsUseUseCase) {}

    execute(
        command: TermsUseUnpublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.unpublish({
            uniqId: command.uniqId,
        });
    }
}
