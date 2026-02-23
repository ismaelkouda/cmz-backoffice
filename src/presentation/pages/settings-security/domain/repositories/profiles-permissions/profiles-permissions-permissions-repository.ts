import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilesPermissionsPermissionsEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ProfilesPermissionsPermissionsRepository {
    abstract execute(): Observable<ProfilesPermissionsPermissionsEntity>;
}
