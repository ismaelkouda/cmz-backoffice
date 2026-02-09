import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParticipantsUpdateCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-update.command';
import { ParticipantsUpdateHandler } from '@presentation/pages/team-organization/application/handlers/participants/participants-update.handler';

@Injectable({ providedIn: 'root' })
export class ParticipantsUpdateBus {
    constructor(private readonly updateHandler: ParticipantsUpdateHandler) {}

    dispatch<T>(command: T): Observable<any> {
        if (command instanceof ParticipantsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
