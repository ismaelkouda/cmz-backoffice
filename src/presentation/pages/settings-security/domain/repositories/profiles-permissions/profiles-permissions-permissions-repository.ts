import { Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ProfilesPermissionsPermissionsRepository {
    abstract execute(
        options?: FetchOptions
    ): Observable<ProfilesPermissionsPermissionsEntity>;
}
