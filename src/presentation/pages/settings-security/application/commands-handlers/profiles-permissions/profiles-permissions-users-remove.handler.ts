import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersRemoveCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-remove.command';
import { ProfilesPermissionsUsersUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersRemoveHandler {
    constructor(private readonly useCase: ProfilesPermissionsUsersUseCase) {}

    execute(
        command: ProfilesPermissionsUsersRemoveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.remove({
            uniqId: command.uniqId,
            users: command.users,
        });
    }
}
