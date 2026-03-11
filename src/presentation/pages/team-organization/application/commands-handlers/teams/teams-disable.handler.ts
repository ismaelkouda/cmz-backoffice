import { Injectable } from '@angular/core';
import { TeamsDisableCommand } from '@pages/team-organization/application/commands/teams/teams-disable.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsDisableHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
