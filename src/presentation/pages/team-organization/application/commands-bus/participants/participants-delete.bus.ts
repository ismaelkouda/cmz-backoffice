import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsDeleteCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-delete.command';
import { ParticipantsDeleteHandler } from '@presentation/pages/team-organization/application/commands-handlers/participants/participants-delete.handler';

@Injectable({ providedIn: 'root' })
export class ParticipantsDeleteBus {
    constructor(private readonly filterHandler: ParticipantsDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
