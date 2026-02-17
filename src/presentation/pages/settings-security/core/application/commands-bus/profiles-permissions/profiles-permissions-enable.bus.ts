import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsEnableCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-enable.command';
import { ProfilesPermissionsEnableHandler } from '@presentation/pages/settings-security/core/application/commands-handlers/profiles-permissions/profiles-permissions-enable.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsEnableBus {
    constructor(
        private readonly filterHandler: ProfilesPermissionsEnableHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
