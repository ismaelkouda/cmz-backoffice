import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsEnableCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-enable.command';
import { TeamsEnableHandler } from '@presentation/pages/team-organization/application/commands-handlers/teams/teams-enable.handler';

@Injectable({ providedIn: 'root' })
export class TeamsEnableBus {
    constructor(private readonly filterHandler: TeamsEnableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
