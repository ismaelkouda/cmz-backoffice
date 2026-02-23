import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersUpdateCommand } from '@presentation/pages/settings-security/application/commands/users/users-update.command';
import { UsersUpdateHandler } from '@presentation/pages/settings-security/application/commands-handlers/users/users-update.handler';

@Injectable({ providedIn: 'root' })
export class UsersUpdateBus {
    constructor(private readonly updateHandler: UsersUpdateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof UsersUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
