import { Injectable, inject } from '@angular/core';
import { ParticipantsCreateCommand } from '@pages/team-organization/application/commands/participants/participants-create.command';
import { ParticipantsCreateHandler } from '@pages/team-organization/application/commands-handlers/participants/participants-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsCreateBus {
    private readonly createHandler = inject(ParticipantsCreateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
