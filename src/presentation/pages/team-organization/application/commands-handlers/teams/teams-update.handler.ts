import { Injectable } from '@angular/core';
import { TeamsUpdateCommand } from '@pages/team-organization/application/commands/teams/teams-update.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsUpdateHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            // code: command.code,
            name: command.name,
            description: command.description,
            reportTypes: command.reportTypes,
            operators: command.operators,
            permissions: command.permissions,
        });
    }
}
