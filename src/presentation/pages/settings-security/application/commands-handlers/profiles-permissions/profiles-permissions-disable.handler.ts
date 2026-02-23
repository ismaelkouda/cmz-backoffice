import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsDisableCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-disable.command';
import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDisableHandler {
    constructor(private readonly useCase: ProfilesPermissionsUseCase) {}

    execute(
        command: ProfilesPermissionsDisableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
