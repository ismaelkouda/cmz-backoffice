import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsPermissionsUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-permissions.use-case';
import { ProfilesPermissionsPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsHandler {
    constructor(
        private readonly useCase: ProfilesPermissionsPermissionsUseCase
    ) {}

    execute(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.useCase.execute();
    }
}
