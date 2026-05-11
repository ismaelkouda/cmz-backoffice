import { Injectable } from '@angular/core';
import { TeamsParticipantsAssignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsUseCase } from '@pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsAssignHandler {
    constructor(private readonly useCase: TeamsParticipantsUseCase) {}

    execute(
        command: TeamsParticipantsAssignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.assign({
            uniqId: command.uniqId,
            role: command.role,
            participants: command.participants,
        });
    }
}
