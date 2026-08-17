import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsEnableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-enable.command';
import { ProfilesPermissionsEnableHandler } from '@pages/settings-security/application/commands-handlers/profiles-permissions/profiles-permissions-enable.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsEnableBus {
    private readonly filterHandler = inject(ProfilesPermissionsEnableHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof ProfilesPermissionsEnableCommand) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
