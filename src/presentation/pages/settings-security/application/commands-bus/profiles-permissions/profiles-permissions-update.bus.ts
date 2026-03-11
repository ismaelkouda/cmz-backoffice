import { Injectable } from '@angular/core';
import { ProfilesPermissionsUpdateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-update.command';
import { ProfilesPermissionsUpdateHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-update.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
