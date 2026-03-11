import { Injectable } from '@angular/core';
import { TeamsParticipantsRemoveCommand } from '@pages/team-organization/application/commands/teams/teams-participants-remove.command';
import { TeamsParticipantsRemoveHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-participants-remove.handler';
import { Observable } from 'rxjs';

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
