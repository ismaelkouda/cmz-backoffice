import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsDisableCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-disable.command';
import { TeamsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsDisableHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
