import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersAssignCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-assign.command';
import { ProfilesPermissionsUsersUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersAssignHandler {
    constructor(private readonly useCase: ProfilesPermissionsUsersUseCase) {}

    execute(
        command: ProfilesPermissionsUsersAssignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.assign({
            uniqId: command.uniqId,
            users: command.users,
        });
    }
}
