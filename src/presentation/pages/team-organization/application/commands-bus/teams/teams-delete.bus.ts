import { Injectable, inject } from '@angular/core';
import { TeamsDeleteCommand } from '@pages/team-organization/application/commands/teams/teams-delete.command';
import { TeamsDeleteHandler } from '@pages/team-organization/application/commands-handlers/teams/teams-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsDeleteBus {
    private readonly filterHandler = inject(TeamsDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof TeamsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
