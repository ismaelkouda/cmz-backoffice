import { Injectable } from '@angular/core';
import { UsersDeleteCommand } from '@pages/settings-security/application/commands/users/users-delete.command';
import { UsersDeleteHandler } from '@pages/settings-security/application/commands-handlers/users/users-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
