import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUsePublishCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-publish.command';
import { TermsUseUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use.use-case';

@Injectable({ providedIn: 'root' })
export class TermsUsePublishHandler {
    constructor(private readonly useCase: TermsUseUseCase) {}

    execute(
        command: TermsUsePublishCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.publish({
            uniqId: command.uniqId,
        });
    }
}
