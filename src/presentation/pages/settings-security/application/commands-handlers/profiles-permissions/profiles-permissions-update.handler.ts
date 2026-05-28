import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUpdateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-update.command';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUpdateHandler {
    private readonly useCase = inject(ProfilesPermissionsUseCase);

    execute(
        command: ProfilesPermissionsUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            name: command.name,
            description: command.description,
            permissions: command.permissions,
        });
    }
}
