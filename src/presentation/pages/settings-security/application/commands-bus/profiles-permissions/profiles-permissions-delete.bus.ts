import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsDeleteCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-delete.command';
import { ProfilesPermissionsDeleteHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-delete.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDeleteBus {
    private readonly filterHandler = inject(ProfilesPermissionsDeleteHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsDeleteCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
