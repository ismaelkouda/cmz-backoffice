import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsPermissionsHandler } from '@pages/settings-security/application/queries-handlers/profiles-permissions/profiles-permissions-permissions.handler';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsBus {
    private readonly filterHandler = inject(
        ProfilesPermissionsPermissionsHandler
    );

    dispatch(): Observable<ProfilesPermissionsPermissionsEntity> {
        return this.filterHandler.execute();
    }
}
