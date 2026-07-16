import { termsUseCreateCommandMapper } from '@pages/content-management/application/commands-mappers/terms-use/terms-use-create.mapper';
import { Injectable, inject } from '@angular/core';
import { TermsUseCreateCommand } from '@pages/content-management/application/commands/terms-use/terms-use-create.command';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseCreateHandler {
    private readonly useCase = inject(TermsUseUseCase);

    execute(
        command: TermsUseCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create(termsUseCreateCommandMapper(command));
    }
}
