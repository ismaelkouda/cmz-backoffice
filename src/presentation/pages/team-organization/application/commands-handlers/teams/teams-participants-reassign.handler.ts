import { teamsParticipantsReassignCommandMapper } from '@pages/team-organization/application/commands-mappers/teams/teams-participants-reassign.mapper';
import { Injectable, inject } from '@angular/core';
import { TeamsParticipantsReassignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsUseCase } from '@pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsReassignHandler {
    private readonly useCase = inject(TeamsParticipantsUseCase);

    execute(
        command: TeamsParticipantsReassignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.reassign(
            teamsParticipantsReassignCommandMapper(command)
        );
    }
}
