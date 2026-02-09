import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { TeamsCreateCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-create.command';
import { TeamsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsCreateHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            code: command.code,
            name: command.name,
            description: command.description,
            reportTypes: command.reportTypes,
            operators: command.operators,
            permissions: command.permissions,
        });
    }
}
