import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsDisableCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-disable.command';
import { TeamsDisableHandler } from '@presentation/pages/team-organization/application/commands-handlers/teams/teams-disable.handler';

@Injectable({ providedIn: 'root' })
export class TeamsDisableBus {
    constructor(private readonly filterHandler: TeamsDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
