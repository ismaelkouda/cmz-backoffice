import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsUpdateCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-update.command';
import { TeamsUpdateHandler } from '@presentation/pages/team-organization/application/handlers/teams/teams-update.handler';

@Injectable({ providedIn: 'root' })
export class TeamsUpdateBus {
    constructor(private readonly updateHandler: TeamsUpdateHandler) {}

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof TeamsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
