import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsParticipantsReassignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsReassignHandler {
    constructor(private readonly useCase: TeamsParticipantsUseCase) {}

    execute(
        command: TeamsParticipantsReassignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.reassign({
            uniqId: command.uniqId,
            participants: command.participants,
        });
    }
}
