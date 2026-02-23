import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersReassignCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';
import { ProfilesPermissionsUsersUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersReassignHandler {
    constructor(private readonly useCase: ProfilesPermissionsUsersUseCase) {}

    execute(
        command: ProfilesPermissionsUsersReassignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.reassign({
            uniqId: command.uniqId,
            users: command.users,
        });
    }
}
