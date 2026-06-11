import { Injectable, inject } from '@angular/core';
import { ProfilesPermissionsUsersQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-users.query';
import { ProfilesPermissionsUsersHandler } from '@pages/settings-security/application/queries-handlers/profiles-permissions/profiles-permissions-users.handler';
import { ProfilesPermissionsUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsUsersBus {
    private readonly filterHandler = inject(ProfilesPermissionsUsersHandler);

    dispatch<T>(
        command: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsUsersEntity>> {
        if (command instanceof ProfilesPermissionsUsersQuery) {
            return this.filterHandler.execute(command, page, options);
        }

        throw new Error('No handler found for command');
    }
}
