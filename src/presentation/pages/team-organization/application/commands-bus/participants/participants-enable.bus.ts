import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsEnableCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-enable.command';
import { ParticipantsEnableHandler } from '@presentation/pages/team-organization/application/commands-handlers/participants/participants-enable.handler';

@Injectable({ providedIn: 'root' })
export class ParticipantsEnableBus {
    constructor(private readonly filterHandler: ParticipantsEnableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
