import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { Observable } from 'rxjs';

export abstract class ProfilesPermissionsSelectRepository {
    abstract readAll(): Observable<ProfilesPermissionsSelectEntity[]>;
}
