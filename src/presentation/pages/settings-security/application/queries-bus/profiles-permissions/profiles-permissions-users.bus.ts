import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersQuery } from '@presentation/pages/settings-security/application/queries/profiles-permissions/profiles-permissions-users.query';
import { ProfilesPermissionsUsersHandler } from '@presentation/pages/settings-security/application/queries-handlers/profiles-permissions/profiles-permissions-users.handler';
import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersBus {
    constructor(
        private readonly filterHandler: ProfilesPermissionsUsersHandler
    ) {}

    dispatch<T>(
        command: T,
        page: string
    ): Observable<Paginate<ProfilesPermissionsUsersEntity>> {
        if (command instanceof ProfilesPermissionsUsersQuery) {
            return this.filterHandler.execute(command, page);
        }

        throw new Error('No handler found for command');
    }
}
