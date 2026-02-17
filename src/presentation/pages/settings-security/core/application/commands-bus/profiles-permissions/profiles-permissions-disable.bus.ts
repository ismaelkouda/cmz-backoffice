import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsDisableCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-disable.command';
import { ProfilesPermissionsDisableHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/profiles-permissions/profiles-permissions-disable.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDisableBus {
    constructor(
        private readonly filterHandler: ProfilesPermissionsDisableHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsDisableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
