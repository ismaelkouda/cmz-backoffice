import { Injectable, inject } from '@angular/core';
import { ParticipantsDisableCommand } from '@pages/team-organization/application/commands/participants/participants-disable.command';
import { ParticipantsUseCase } from '@pages/team-organization/application/use-cases/participants/participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsDisableHandler {
    private readonly useCase = inject(ParticipantsUseCase);

    execute(
        command: ParticipantsDisableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
