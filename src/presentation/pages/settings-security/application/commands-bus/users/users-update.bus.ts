import { Injectable } from '@angular/core';
import { UsersUpdateCommand } from '@pages/settings-security/application/commands/users/users-update.command';
import { UsersUpdateHandler } from '@pages/settings-security/application/commands-handlers/users/users-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
