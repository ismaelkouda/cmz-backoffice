import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsQuery } from '@presentation/pages/settings-security/core/application/queries/profiles-permissions/profiles-permissions.query';
import { ProfilesPermissionsHandler } from '@presentation/pages/settings-security/core/application/queries-handlers/profiles-permissions/profiles-permissions.handler';
import { ProfilesPermissionsEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsBus {
    constructor(private readonly filterHandler: ProfilesPermissionsHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<ProfilesPermissionsEntity>> {
        if (query instanceof ProfilesPermissionsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
