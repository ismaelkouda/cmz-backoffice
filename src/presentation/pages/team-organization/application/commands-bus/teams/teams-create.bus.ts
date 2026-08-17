import { Injectable, inject } from '@angular/core';
import { TeamsCreateCommand } from '@pages/team-organization/application/commands/teams/teams-create.command';
import { TeamsCreateHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsCreateBus {
    private readonly createHandler = inject(TeamsCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
