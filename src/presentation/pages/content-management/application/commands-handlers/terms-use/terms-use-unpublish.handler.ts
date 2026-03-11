import { Injectable } from '@angular/core';
import { TermsUseUnpublishCommand } from '@pages/content-management/application/commands/terms-use/terms-use-unpublish.command';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
