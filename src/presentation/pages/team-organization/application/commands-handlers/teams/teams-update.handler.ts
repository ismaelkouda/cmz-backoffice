import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsUpdateCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-update.command';
import { TeamsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsUpdateHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            code: command.code,
            name: command.name,
            description: command.description,
            reportTypes: command.reportTypes,
            operators: command.operators,
            permissions: command.permissions,
        });
    }
}
