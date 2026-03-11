import { Injectable } from '@angular/core';
import { TermsUsePublishCommand } from '@pages/content-management/application/commands/terms-use/terms-use-publish.command';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
