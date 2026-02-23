import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsCreateCommand } from '@presentation/pages/settings-security/application/commands/profiles-permissions/profiles-permissions-create.command';
import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions.use-case';

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
