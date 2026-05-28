import { Injectable, inject } from '@angular/core';
import { TeamsParticipantsRemoveCommand } from '@pages/team-organization/application/commands/teams/teams-participants-remove.command';
import { TeamsParticipantsUseCase } from '@pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsRemoveHandler {
    private readonly useCase = inject(TeamsParticipantsUseCase);

    execute(
        command: TeamsParticipantsRemoveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.remove({
            uniqId: command.uniqId,
            participants: command.participants,
        });
    }
}
