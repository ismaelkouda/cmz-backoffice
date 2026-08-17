import { Injectable, inject } from '@angular/core';
import { ParticipantsUpdateCommand } from '@pages/team-organization/application/commands/participants/participants-update.command';
import { ParticipantsUpdateHandler } from '@pages/team-organization/application/commands-handlers/participants/participants-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsUpdateBus {
    private readonly updateHandler = inject(ParticipantsUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
