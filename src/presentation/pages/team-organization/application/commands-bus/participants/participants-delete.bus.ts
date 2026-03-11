import { Injectable } from '@angular/core';
import { ParticipantsDeleteCommand } from '@pages/team-organization/application/commands/participants/participants-delete.command';
import { ParticipantsDeleteHandler } from '@pages/team-organization/application/commands-handlers/participants/participants-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
