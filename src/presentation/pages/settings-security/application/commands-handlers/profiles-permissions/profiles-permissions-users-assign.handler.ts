import { Injectable } from '@angular/core';
import { ProfilesPermissionsUsersAssignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-assign.command';
import { ProfilesPermissionsUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
