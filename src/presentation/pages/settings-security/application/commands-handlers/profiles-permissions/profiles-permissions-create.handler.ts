import { Injectable } from '@angular/core';
import { ProfilesPermissionsCreateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-create.command';
import { ProfilesPermissionsUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsCreateHandler {
    constructor(private readonly useCase: ProfilesPermissionsUseCase) {}

    execute(
        command: ProfilesPermissionsCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            name: command.name,
            description: command.description,
            permissions: command.permissions,
        });
    }
}
