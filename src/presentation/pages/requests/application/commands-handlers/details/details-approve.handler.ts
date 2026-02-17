import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsApproveCommand } from '@presentation/pages/requests/application/commands/details/details-approve.command';
import { DetailsUseCase } from '@presentation/pages/requests/application/use-cases/details/details.use-case';

@Injectable({ providedIn: 'root' })
export class DetailsApproveHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(
        command: DetailsApproveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.approve({
            uniqId: command.uniqId,
            comment: command.comment,
        });
    }
}
