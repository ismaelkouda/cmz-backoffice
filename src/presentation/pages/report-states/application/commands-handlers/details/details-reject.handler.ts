import { Injectable, inject } from '@angular/core';
import { DetailsRejectCommand } from '@pages/report-states/application/commands/details/details-reject.command';
import { DetailsUseCase } from '@pages/report-states/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsRejectHandler {
    private readonly useCase = inject(DetailsUseCase);

    execute(
        command: DetailsRejectCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.reject({
            uniqId: command.uniqId,
            comment: command.comment,
            reason: command.reason,
            callbackType: command.callbackType,
        });
    }
}
