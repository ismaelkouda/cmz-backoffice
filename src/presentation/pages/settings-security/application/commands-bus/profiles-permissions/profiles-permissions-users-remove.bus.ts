import { Injectable } from '@angular/core';
import { ProfilesPermissionsUsersRemoveCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-remove.command';
import { ProfilesPermissionsUsersRemoveHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-users-remove.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersRemoveBus {
    constructor(
        private readonly removeHandler: ProfilesPermissionsUsersRemoveHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsUsersRemoveCommand) {
            return this.removeHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
