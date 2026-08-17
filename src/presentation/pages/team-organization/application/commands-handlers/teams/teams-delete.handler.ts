import { teamsDeleteCommandMapper } from '@pages/team-organization/application/commands-mappers/teams/teams-delete.mapper';
import { Injectable, inject } from '@angular/core';
import { TeamsDeleteCommand } from '@pages/team-organization/application/commands/teams/teams-delete.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsDeleteHandler {
    private readonly useCase = inject(TeamsUseCase);

    execute(command: TeamsDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete(teamsDeleteCommandMapper(command));
    }
}
