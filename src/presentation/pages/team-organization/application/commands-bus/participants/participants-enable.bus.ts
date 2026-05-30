import { Injectable, inject } from '@angular/core';
import { ParticipantsEnableCommand } from '@pages/team-organization/application/commands/participants/participants-enable.command';
import { ParticipantsEnableHandler } from '@pages/team-organization/application/commands-handlers/participants/participants-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantsEnableBus {
    private readonly filterHandler = inject(ParticipantsEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ParticipantsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
