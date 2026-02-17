import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsDeleteCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-delete.command';
import { TeamsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams.use-case';

@Injectable({ providedIn: 'root' })
export class TeamsDeleteHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
