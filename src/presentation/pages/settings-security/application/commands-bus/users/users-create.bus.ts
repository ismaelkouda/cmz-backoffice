import { Injectable } from '@angular/core';
import { UsersCreateCommand } from '@pages/settings-security/application/commands/users/users-create.command';
import { UsersCreateHandler } from '@pages/settings-security/application/commands-handlers/users/users-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
