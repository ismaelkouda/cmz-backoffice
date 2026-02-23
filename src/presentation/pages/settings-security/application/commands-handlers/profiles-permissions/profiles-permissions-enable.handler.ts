import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsEnableCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-enable.command';
import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsEnableHandler {
    constructor(private readonly useCase: ProfilesPermissionsUseCase) {}

    execute(
        command: ProfilesPermissionsEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
