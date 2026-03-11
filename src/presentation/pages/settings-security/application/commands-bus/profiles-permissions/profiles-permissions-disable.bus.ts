import { Injectable } from '@angular/core';
import { ProfilesPermissionsDisableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-disable.command';
import { ProfilesPermissionsDisableHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-disable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
