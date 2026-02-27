import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TermsUseDeleteCommand } from '@presentation/pages/content-management/application/commands/terms-use/terms-use-delete.command';
import { TermsUseUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use.use-case';

@Injectable({ providedIn: 'root' })
export class TermsUseDeleteHandler {
    constructor(private readonly useCase: TermsUseUseCase) {}

    execute(
        command: TermsUseDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
