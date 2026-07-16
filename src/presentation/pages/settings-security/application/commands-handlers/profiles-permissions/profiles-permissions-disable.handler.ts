import { profilesPermissionsDisableCommandMapper } from '@pages/settings-security/application/commands-mappers/profiles-permissions/profiles-permissions-disable.mapper';
import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsDisableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-disable.command';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsDisableHandler {
    private readonly useCase = inject(ProfilesPermissionsUseCase);

    execute(
        command: ProfilesPermissionsDisableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable(
            profilesPermissionsDisableCommandMapper(command)
        );
    }
}
