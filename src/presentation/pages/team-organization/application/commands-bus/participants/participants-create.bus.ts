import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ParticipantsCreateCommand } from '@presentation/pages/team-organization/application/commands/participants/participants-create.command';
import { ParticipantsCreateHandler } from '@presentation/pages/team-organization/application/commands-handlers/participants/participants-create.handler';

@Injectable({ providedIn: 'root' })
export class ParticipantsCreateBus {
    constructor(private readonly createHandler: ParticipantsCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
