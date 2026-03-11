import { ProfilesPermissionsFindOneFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one-filter.entity';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { Observable } from 'rxjs';

export abstract class ProfilesPermissionsFindOneRepository {
    abstract execute(
        filter?: ProfilesPermissionsFindOneFilterEntity
    ): Observable<ProfilesPermissionsFindOneEntity>;
}
