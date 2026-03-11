import { Injectable } from '@angular/core';
import { TeamsDeleteCommand } from '@pages/team-organization/application/commands/teams/teams-delete.command';
import { TeamsUseCase } from '@pages/team-organization/application/use-cases/teams/teams.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsDeleteHandler {
    constructor(private readonly useCase: TeamsUseCase) {}

    execute(command: TeamsDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
