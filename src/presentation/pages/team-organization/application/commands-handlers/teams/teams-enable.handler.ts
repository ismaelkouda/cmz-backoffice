import { teamsEnableCommandMapper } from '@pages/team-organization/application/commands-mappers/teams/teams-enable.mapper';
import { Injectable, inject } from '@angular/core';
import { TeamsEnableCommand } from '@pages/team-organization/application/commands/teams/teams-enable.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsEnableHandler {
    private readonly useCase = inject(TeamsUseCase);

    execute(command: TeamsEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable(teamsEnableCommandMapper(command));
    }
}
