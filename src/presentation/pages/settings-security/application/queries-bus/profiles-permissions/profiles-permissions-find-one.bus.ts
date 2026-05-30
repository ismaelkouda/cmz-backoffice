import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsFindOneQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-find-one.query';
import { ProfilesPermissionsFindOneHandler } from '@pages/settings-security/application/queries-handlers/profiles-permissions/profiles-permissions-find-one.handler';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneBus {
    private readonly filterHandler = inject(ProfilesPermissionsFindOneHandler);

    dispatch<T>(command: T): Observable<ProfilesPermissionsFindOneEntity> {
        if (command instanceof ProfilesPermissionsFindOneQuery) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
