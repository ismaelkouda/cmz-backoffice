import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersDisableCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-disable.command';
import { UsersDisableHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/users/users-disable.handler';

@Injectable({ providedIn: 'root' })
export class UsersDisableBus {
    constructor(private readonly filterHandler: UsersDisableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof UsersDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
