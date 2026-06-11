import { ProfilesPermissionsUsersAssignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-assign.entity';
import { ProfilesPermissionsUsersFilterEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-filter.entity';
import { ProfilesPermissionsUsersReassignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-reassign.entity';
import { ProfilesPermissionsUsersRemoveEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users-remove.entity';
import { ProfilesPermissionsUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-users.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ProfilesPermissionsUsersRepository {
    abstract execute(
        filter: ProfilesPermissionsUsersFilterEntity | null,
        page: string,
        options?: FetchOptions
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
