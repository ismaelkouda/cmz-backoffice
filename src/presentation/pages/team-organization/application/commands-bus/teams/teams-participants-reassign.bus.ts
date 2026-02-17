import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsParticipantsReassignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsReassignHandler } from '@presentation/pages/team-organization/application/commands-handlers/teams/teams-participants-reassign.handler';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsReassignBus {
    constructor(
        private readonly reassignHandler: TeamsParticipantsReassignHandler
    ) {}

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof TeamsParticipantsReassignCommand) {
            return this.reassignHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
