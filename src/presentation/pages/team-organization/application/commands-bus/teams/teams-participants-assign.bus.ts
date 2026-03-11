import { Injectable } from '@angular/core';
import { TeamsParticipantsAssignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-assign.command';
import { TeamsParticipantsAssignHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-participants-assign.handler';
import { Observable } from 'rxjs';

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
