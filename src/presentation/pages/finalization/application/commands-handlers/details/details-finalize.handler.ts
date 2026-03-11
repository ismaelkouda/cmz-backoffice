import { Injectable } from '@angular/core';
import { DetailsFinalizeCommand } from '@pages/finalization/application/commands/details/details-finalize.command';
import { DetailsUseCase } from '@pages/finalization/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
