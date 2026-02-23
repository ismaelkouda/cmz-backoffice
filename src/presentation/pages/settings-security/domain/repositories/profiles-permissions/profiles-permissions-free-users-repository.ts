import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { ProfilesPermissionsFreeUsersAssignEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';

export abstract class ProfilesPermissionsFreeUsersRepository {
    abstract execute(
        page: string
    ): Observable<Paginate<ProfilesPermissionsFreeUsersEntity>>;

    abstract assign(
        dto: ProfilesPermissionsFreeUsersAssignEntity
    ): Observable<SimpleResponseDto<void>>;
}
