import { ProfilesPermissionsFreeUsersAssignEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users-assign.entity';
import { ProfilesPermissionsFreeUsersEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-free-users.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ProfilesPermissionsFreeUsersRepository {
    abstract execute(
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ProfilesPermissionsFreeUsersEntity>>;

    abstract assign(
        dto: ProfilesPermissionsFreeUsersAssignEntity
    ): Observable<SimpleResponseDto<void>>;
}
