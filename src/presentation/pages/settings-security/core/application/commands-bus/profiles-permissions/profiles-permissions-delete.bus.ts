import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsDeleteCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-delete.command';
import { ProfilesPermissionsDeleteHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/profiles-permissions/profiles-permissions-delete.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDeleteBus {
    constructor(
        private readonly filterHandler: ProfilesPermissionsDeleteHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
