import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsEnableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-enable.command';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsEnableHandler {
    private readonly useCase = inject(ProfilesPermissionsUseCase);

    execute(
        command: ProfilesPermissionsEnableCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
