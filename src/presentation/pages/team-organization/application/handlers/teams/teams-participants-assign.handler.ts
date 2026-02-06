import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { TeamsParticipantsAssignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsAssignHandler {
    constructor(private readonly useCase: TeamsParticipantsUseCase) {}

    execute(
        command: TeamsParticipantsAssignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.assign({
            uniqId: command.uniqId,
            participants: command.participants,
        });
    }
}
