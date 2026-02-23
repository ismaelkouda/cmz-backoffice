import { Observable } from 'rxjs';

import { ProfilesPermissionsFindOneFilterEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';

export abstract class ProfilesPermissionsFindOneRepository {
    abstract execute(
        filter?: ProfilesPermissionsFindOneFilterEntity
    ): Observable<ProfilesPermissionsFindOneEntity>;
}
