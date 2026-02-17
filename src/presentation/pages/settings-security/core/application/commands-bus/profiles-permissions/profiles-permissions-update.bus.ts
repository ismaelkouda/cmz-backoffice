import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUpdateCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-update.command';
import { ProfilesPermissionsUpdateHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/profiles-permissions/profiles-permissions-update.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUpdateBus {
    constructor(
        private readonly updateHandler: ProfilesPermissionsUpdateHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsUpdateCommand) {
            return this.updateHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
