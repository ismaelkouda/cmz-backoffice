import { Injectable, inject } from '@angular/core';
import { TeamsCreateCommand } from '@pages/team-organization/application/commands/teams/teams-create.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsCreateHandler {
    private readonly useCase = inject(TeamsUseCase);

    execute(command: TeamsCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            // code: command.code,
            name: command.name,
            description: command.description,
            reportTypes: command.reportTypes,
            operators: command.operators,
            permissions: command.permissions,
        });
    }
}
