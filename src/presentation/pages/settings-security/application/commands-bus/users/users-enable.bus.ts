import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersEnableCommand } from '@presentation/pages/settings-security/application/commands/users/users-enable.command';
import { UsersEnableHandler } from '@presentation/pages/settings-security/application/commands-handlers/users/users-enable.handler';

@Injectable({ providedIn: 'root' })
export class UsersEnableBus {
    constructor(private readonly filterHandler: UsersEnableHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof UsersEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
