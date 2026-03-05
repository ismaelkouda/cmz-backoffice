import { Observable } from 'rxjs';

import { ProfilesPermissionsSelectEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';

export abstract class ProfilesPermissionsSelectRepository {
    abstract readAll(): Observable<ProfilesPermissionsSelectEntity[]>;
}
