import { Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ProfilesPermissionsPermissionsRepository {
    abstract execute(): Observable<ProfilesPermissionsPermissionsEntity>;
}
