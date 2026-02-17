import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersReassignCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';
import { ProfilesPermissionsUsersReassignHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/profiles-permissions/profiles-permissions-users-reassign.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersReassignBus {
    constructor(
        private readonly reassignHandler: ProfilesPermissionsUsersReassignHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsUsersReassignCommand) {
            return this.reassignHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
