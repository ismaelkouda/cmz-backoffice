import { Observable } from 'rxjs';

import { ProfilesSelectEntity } from '@presentation/pages/settings-security/core/domain/entities/users/profiles-select.entity';

export abstract class ProfilesSelectRepository {
    abstract readAll(): Observable<ProfilesSelectEntity[]>;
}
