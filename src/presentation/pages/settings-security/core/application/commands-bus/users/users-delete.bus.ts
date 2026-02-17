import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { UsersDeleteCommand } from '@presentation/pages/settings-security/core/application/commands/users/users-delete.command';
import { UsersDeleteHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/users/users-delete.handler';

@Injectable({ providedIn: 'root' })
export class UsersDeleteBus {
    constructor(private readonly filterHandler: UsersDeleteHandler) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof UsersDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
