import { Injectable } from '@angular/core';
import { ProfilesPermissionsCreateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-create.command';
import { ProfilesPermissionsCreateHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-create.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
