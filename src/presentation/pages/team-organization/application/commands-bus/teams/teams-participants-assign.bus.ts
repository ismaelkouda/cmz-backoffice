import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsParticipantsAssignCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsAssignHandler } from '@presentation/pages/team-organization/application/commands-handlers/teams/teams-participants-assign.handler';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsAssignBus {
    constructor(
        private readonly assignHandler: TeamsParticipantsAssignHandler
    ) {}

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof TeamsParticipantsAssignCommand) {
            return this.assignHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
