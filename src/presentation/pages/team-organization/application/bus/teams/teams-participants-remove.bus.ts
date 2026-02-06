import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsParticipantsRemoveCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-remove.command';
import { TeamsParticipantsRemoveHandler } from '@presentation/pages/team-organization/application/handlers/teams/teams-participants-remove.handler';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsRemoveBus {
    constructor(
        private readonly removeHandler: TeamsParticipantsRemoveHandler
    ) {}

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof TeamsParticipantsRemoveCommand) {
            return this.removeHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
