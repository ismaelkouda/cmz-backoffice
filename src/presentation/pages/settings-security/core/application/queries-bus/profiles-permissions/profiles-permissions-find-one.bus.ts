import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsFindOneQuery } from '@presentation/pages/settings-security/core/application/queries/profiles-permissions/profiles-permissions-find-one.query';
import { ProfilesPermissionsFindOneHandler } from '@presentation/pages/settings-security/core/application/queries-handlers/profiles-permissions/profiles-permissions-find-one.handler';
import { ProfilesPermissionsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneBus {
    constructor(
        private readonly filterHandler: ProfilesPermissionsFindOneHandler
    ) {}

    dispatch<T>(command: T): Observable<ProfilesPermissionsFindOneEntity> {
        if (command instanceof ProfilesPermissionsFindOneQuery) {
            return this.filterHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
