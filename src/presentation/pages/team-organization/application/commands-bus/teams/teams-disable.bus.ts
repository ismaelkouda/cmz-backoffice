import { Injectable } from '@angular/core';
import { TeamsDisableCommand } from '@pages/team-organization/application/commands/teams/teams-disable.command';
import { TeamsDisableHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
