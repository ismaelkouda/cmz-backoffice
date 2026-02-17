import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersCreateCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-create.command';
import { UsersCreateHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/users/users-create.handler';

@Injectable({ providedIn: 'root' })
export class UsersCreateBus {
    constructor(private readonly createHandler: UsersCreateHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof UsersCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
