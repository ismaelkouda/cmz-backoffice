import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsCreateCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-create.command';
import { ProfilesPermissionsCreateHandler } from '@presentation/pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-create.handler';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsCreateBus {
    constructor(
        private readonly createHandler: ProfilesPermissionsCreateHandler
    ) {}

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsCreateCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
