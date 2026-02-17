import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsParticipantsRemoveCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-remove.command';
import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsRemoveHandler {
    constructor(private readonly useCase: TeamsParticipantsUseCase) {}

    execute(
        command: TeamsParticipantsRemoveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.remove({
            uniqId: command.uniqId,
            participants: command.participants,
        });
    }
}
