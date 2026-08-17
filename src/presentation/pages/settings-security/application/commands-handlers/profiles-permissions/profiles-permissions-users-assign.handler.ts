import { profilesPermissionsUsersAssignCommandMapper } from '@pages/settings-security/application/commands-mappers/profiles-permissions/profiles-permissions-users-assign.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersAssignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-assign.command';
import { ProfilesPermissionsUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersAssignHandler {
    private readonly useCase = inject(ProfilesPermissionsUsersUseCase);

    execute(
        command: ProfilesPermissionsUsersAssignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.assign(
            profilesPermissionsUsersAssignCommandMapper(command)
        );
    }
}
