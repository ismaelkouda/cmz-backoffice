import { Injectable } from '@angular/core';
import { ProfilesPermissionsUsersReassignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';
import { ProfilesPermissionsUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
