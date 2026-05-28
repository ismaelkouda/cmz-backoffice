import { Injectable, inject } from '@angular/core';
import { TermsUseDeleteCommand } from '@pages/content-management/application/commands/terms-use/terms-use-delete.command';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseDeleteHandler {
    private readonly useCase = inject(TermsUseUseCase);

    execute(
        command: TermsUseDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
