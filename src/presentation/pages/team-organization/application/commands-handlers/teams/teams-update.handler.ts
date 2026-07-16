import { teamsUpdateCommandMapper } from '@pages/team-organization/application/commands-mappers/teams/teams-update.mapper';
import { Injectable, inject } from '@angular/core';
import { TeamsUpdateCommand } from '@pages/team-organization/application/commands/teams/teams-update.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsUpdateHandler {
    private readonly useCase = inject(TeamsUseCase);

    execute(command: TeamsUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update(teamsUpdateCommandMapper(command));
    }
}
