import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersAssignCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-users-assign.command';
import { ProfilesPermissionsUsersAssignHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/profiles-permissions/profiles-permissions-users-assign.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersAssignBus {
    constructor(
        private readonly assignHandler: ProfilesPermissionsUsersAssignHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsUsersAssignCommand) {
            return this.assignHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
