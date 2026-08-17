import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersReassignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';
import { ProfilesPermissionsUsersReassignHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-users-reassign.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersReassignBus {
    private readonly reassignHandler = inject(
        ProfilesPermissionsUsersReassignHandler
    );

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsUsersReassignCommand) {
            return this.reassignHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
