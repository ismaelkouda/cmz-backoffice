import { profilesPermissionsUsersReassignCommandMapper } from '@pages/settings-security/application/commands-mappers/profiles-permissions/profiles-permissions-users-reassign.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersReassignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';
import { ProfilesPermissionsUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersReassignHandler {
    private readonly useCase = inject(ProfilesPermissionsUsersUseCase);

    execute(
        command: ProfilesPermissionsUsersReassignCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.reassign(
            profilesPermissionsUsersReassignCommandMapper(command)
        );
    }
}
