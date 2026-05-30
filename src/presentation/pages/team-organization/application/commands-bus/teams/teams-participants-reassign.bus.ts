import { Injectable, inject } from '@angular/core';
import { TeamsParticipantsReassignCommand } from '@pages/team-organization/application/commands/teams/teams-participants-reassign.command';
import { TeamsParticipantsReassignHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-participants-reassign.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsReassignBus {
    private readonly reassignHandler = inject(TeamsParticipantsReassignHandler);

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof TeamsParticipantsReassignCommand) {
            return this.reassignHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
