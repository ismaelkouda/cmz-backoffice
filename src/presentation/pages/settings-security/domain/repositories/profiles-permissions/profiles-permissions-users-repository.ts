import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsUsersAssignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-assign.entity';
import { ProfilesPermissionsUsersFilterEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-filter.entity';
import { ProfilesPermissionsUsersReassignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-reassign.entity';
import { ProfilesPermissionsUsersRemoveEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-remove.entity';
import { ProfilesPermissionsUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';

export abstract class ProfilesPermissionsUsersRepository {
    abstract execute(
        filter: ProfilesPermissionsUsersFilterEntity | null,
        page: string
    ): Observable<Paginate<ProfilesPermissionsUsersEntity>>;

    abstract reassign(
        dto: ProfilesPermissionsUsersReassignEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract assign(
        dto: ProfilesPermissionsUsersAssignEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract remove(
        dto: ProfilesPermissionsUsersRemoveEntity
    ): Observable<SimpleResponseDto<void>>;
}
