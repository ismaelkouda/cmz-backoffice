import { profilesPermissionsUsersRemoveCommandMapper } from '@pages/settings-security/application/commands-mappers/profiles-permissions/profiles-permissions-users-remove.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersRemoveCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-remove.command';
import { ProfilesPermissionsUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersRemoveHandler {
    private readonly useCase = inject(ProfilesPermissionsUsersUseCase);

    execute(
        command: ProfilesPermissionsUsersRemoveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.remove(
            profilesPermissionsUsersRemoveCommandMapper(command)
        );
    }
}
