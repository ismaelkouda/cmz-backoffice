import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUpdateCommand } from '@presentation/pages/settings-security/core/application/commands/profiles-permissions/profiles-permissions-update.command';
import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUpdateHandler {
    constructor(private readonly useCase: ProfilesPermissionsUseCase) {}

    execute(
        command: ProfilesPermissionsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            name: command.name,
            description: command.description,
            permissions: command.permissions,
        });
    }
}
