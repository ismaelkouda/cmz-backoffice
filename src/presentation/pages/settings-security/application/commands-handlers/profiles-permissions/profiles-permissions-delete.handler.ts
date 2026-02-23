import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsDeleteCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-delete.command';
import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDeleteHandler {
    constructor(private readonly useCase: ProfilesPermissionsUseCase) {}

    execute(
        command: ProfilesPermissionsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
