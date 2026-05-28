import { Injectable, inject } from '@angular/core';
import { TeamsUpdateCommand } from '@pages/team-organization/application/commands/teams/teams-update.command';
import { TeamsUpdateHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsUpdateBus {
    private readonly updateHandler = inject(TeamsUpdateHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
