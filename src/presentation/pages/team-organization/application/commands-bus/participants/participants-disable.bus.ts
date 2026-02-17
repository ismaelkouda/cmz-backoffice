import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsDisableCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-disable.command';
import { ParticipantsDisableHandler } from '@presentation/pages/team-organization/application/commands-handlers/participants/participants-disable.handler';

@Injectable({ providedIn: 'root' })
export class ParticipantsDisableBus {
    constructor(private readonly filterHandler: ParticipantsDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
