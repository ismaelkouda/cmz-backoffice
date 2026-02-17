import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsPermissionsHandler } from '@presentation/pages/settings-security/core/application/queries-handlers/profiles-permissions/profiles-permissions-permissions.handler';
import { ProfilesPermissionsPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsBus {
    constructor(
        private readonly filterHandler: ProfilesPermissionsPermissionsHandler
    ) {}

    dispatch(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.filterHandler.execute();
    }
}
