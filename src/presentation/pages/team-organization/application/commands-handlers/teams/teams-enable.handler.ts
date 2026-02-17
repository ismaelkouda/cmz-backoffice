import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsEnableCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-enable.command';
import { TeamsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsEnableHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
