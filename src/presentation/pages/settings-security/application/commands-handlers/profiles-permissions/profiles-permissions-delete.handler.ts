import { profilesPermissionsDeleteCommandMapper } from '@pages/settings-security/application/commands-mappers/profiles-permissions/profiles-permissions-delete.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsDeleteCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-delete.command';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDeleteHandler {
    private readonly useCase = inject(ProfilesPermissionsUseCase);

    execute(
        command: ProfilesPermissionsDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete(
            profilesPermissionsDeleteCommandMapper(command)
        );
    }
}
