import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ProfilesPermissionsSelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<ProfilesPermissionsSelectEntity[]>;
}
