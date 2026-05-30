import { Injectable, inject } from '@angular/core';
import { TeamsEnableCommand } from '@pages/team-organization/application/commands/teams/teams-enable.command';
import { TeamsEnableHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsEnableBus {
    private readonly filterHandler = inject(TeamsEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
