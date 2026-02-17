import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFinalizeCommand } from '@presentation/pages/finalization/application/commands/details/details-finalize.command';
import { DetailsUseCase } from '@presentation/pages/finalization/application/use-cases/details/details.use-case';

@Injectable({ providedIn: 'root' })
export class DetailsFinalizeHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(
        command: DetailsFinalizeCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.finalize({
            uniqId: command.uniqId,
            comment: command.comment,
        });
    }
}
