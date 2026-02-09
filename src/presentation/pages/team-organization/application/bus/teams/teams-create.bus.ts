import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsCreateCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-create.command';
import { TeamsCreateHandler } from '@presentation/pages/team-organization/application/handlers/teams/teams-create.handler';

@Injectable({ providedIn: 'root' })
export class TeamsCreateBus {
    constructor(private readonly createHandler: TeamsCreateHandler) {}

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof TeamsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
