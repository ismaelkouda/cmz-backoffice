import { Injectable } from '@angular/core';
import { ProfilesPermissionsUsersAssignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-assign.command';
import { ProfilesPermissionsUsersAssignHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-users-assign.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
