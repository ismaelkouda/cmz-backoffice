import { Injectable, inject } from '@angular/core';
import { UsersEnableCommand } from '@pages/settings-security/application/commands/users/users-enable.command';
import { UsersEnableHandler } from '@pages/settings-security/application/commands-handlers/users/users-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersEnableBus {
    private readonly filterHandler = inject(UsersEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof UsersEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
