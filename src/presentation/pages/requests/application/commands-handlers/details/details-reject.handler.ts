import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsRejectCommand } from '@presentation/pages/requests/application/commands/details/details-reject.command';
import { DetailsUseCase } from '@presentation/pages/requests/application/use-cases/details/details.use-case';

@Injectable({ providedIn: 'root' })
export class DetailsRejectHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(
        command: DetailsRejectCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.reject({
            uniqId: command.uniqId,
            comment: command.comment,
            reason: command.reason,
        });
    }
}
