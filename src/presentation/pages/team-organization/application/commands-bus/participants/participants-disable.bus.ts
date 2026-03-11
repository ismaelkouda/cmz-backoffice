import { Injectable } from '@angular/core';
import { ParticipantsDisableCommand } from '@pages/team-organization/application/commands/participants/participants-disable.command';
import { ParticipantsDisableHandler } from '@pages/team-organization/application/commands-handlers/participants/participants-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
