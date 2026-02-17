import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { TeamsDeleteCommand } from '@presentation/pages/team-organization/application/commands/teams/teams-delete.command';
import { TeamsDeleteHandler } from '@presentation/pages/team-organization/application/commands-handlers/teams/teams-delete.handler';

@Injectable({ providedIn: 'root' })
export class TeamsDeleteBus {
    constructor(private readonly filterHandler: TeamsDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
