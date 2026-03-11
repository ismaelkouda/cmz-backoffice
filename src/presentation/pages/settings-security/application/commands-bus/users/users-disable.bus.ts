import { Injectable } from '@angular/core';
import { UsersDisableCommand } from '@pages/settings-security/application/commands/users/users-disable.command';
import { UsersDisableHandler } from '@pages/settings-security/application/commands-handlers/users/users-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
