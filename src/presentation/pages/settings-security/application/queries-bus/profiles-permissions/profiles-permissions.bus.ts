import { Injectable } from '@angular/core';
import { ProfilesPermissionsQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions.query';
import { ProfilesPermissionsHandler } from '@pages/settings-security/application/queries-handlers/profiles-permissions/profiles-permissions.handler';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
